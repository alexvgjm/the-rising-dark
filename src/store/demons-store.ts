import { computed, ComputedRef } from "@vue/reactivity";
import { defineStore } from "pinia";
import { reactive, Ref, ref } from "vue";
import { Consumer, Converter, Producer } from "../app-types";
import { levelFromExp, randomInt, randomPick, shuffle } from "../controllers/utils";
import { useBuildingsStore } from "./buildings-store";


export type Profession = {
    name: string,
    description: string,
    metadescription: string,
    producers: Producer[],
    consumers: Consumer[],
    converters: Converter[]
}

export type DemonType = 'Imp' | 'Grunt'

export interface Demon {
    type: DemonType,
    name: string,
    profession: Profession,
    upkeep: Consumer[],
    loyalty: number,
    experience: number,
    level: number
}
export interface DemonCapacity {
    demon: DemonType,
    capacity: ()=>number
}

const namePool = {
    'Imp': ['Cyec', 'Ublul', 'Shuphux', 'Trum', 'Tuphe', 'Grogfi', 
            'Xaar', 'Draarme', 'Gekjoc', 'Szur', 'Gnat', 'Crigbin', 'Abbub', 
            'Yep', 'Trabqaic', 'Shelpic', 'Rul', 'Tyoljiup', 'Japkop', 'Cyiux'],
            
    'Grunt': []
}

export const useDemonsStore = defineStore(
    'demons',
    () => {
        const buildingStore = useBuildingsStore()
        const demons = reactive<Demon[]>([])

        
        const baseCapacity = {
            'Imp': 0,
            'Grunt': 0
        }

        const professions: {[key: string]: Profession} = {
            'Rat hunter': {
                name: 'Rat hunter',
                description: 'Gather 🐀 food (+0.05/s) per level. Sometimes kill humans. Brings XP over time.',
                metadescription: `It's not so easy to distinguish humans from rats.`,
                producers: [{
                    resource: 'Food',
                    description: 'Rat hunting',
                    quantity: ()=>0.05
                }],
                consumers: [],
                converters: []
            }
        }

        const availableProfession = {
            'Imp': ['Rat hunter'],
            'Grunt': ['Rat hunter']
        }

        const upkeeps: {[key: string]: Consumer[]} = {
            'Imp': [{
                description: 'Imp souls upkeep',
                resource: 'Souls',
                quantity: ()=>0.01
            }],
            'Grunt': []
        }

        function getDemonCapacityOf(type: DemonType) {
            return Object.values(buildingStore.buildingDemonCapacity)
                .flat()
                .filter((dc) => dc.demon == 'Imp')
                .reduce((acc, dc) => acc + dc.capacity(), baseCapacity[type])
        }

        function getFreeName(type: DemonType) {
            const pool = namePool[type]
            shuffle(pool)

            const currentNames = demons.filter(d => d.type == type)
                                       .map(d => d.name)

            const name = pool.find(name => !currentNames.includes(name))
            return name ? name : pool[0]
        }

        function newDemon(type: DemonType) {
            const name = getFreeName(type)
            const professionName = randomPick(availableProfession[type])

            const newDemon: Demon = {
                name, type, 
                experience: randomInt(1, 150),
                loyalty: randomInt(30, 70),
                profession: {...professions[professionName]},
                upkeep: [],
                get level() { return levelFromExp(this.experience)},
            }
            
            newDemon.profession.producers = newDemon.profession.producers
                .map(p => {
                    return {
                        ...p,
                        quantity: ()=>p.quantity() * newDemon.level
                    }
                })
            
            newDemon.upkeep = upkeeps[type].map<Consumer>(cons => { return {
                ...cons,
                quantity: () => cons.quantity() * (newDemon.level / 3)
            }})
            
            demons.push(newDemon)
            return newDemon
        }

        return {demons, newDemon, baseCapacity, getDemonCapacityOf}
    }
)