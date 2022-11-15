import { computed, ComputedRef } from "@vue/reactivity";
import { defineStore } from "pinia";
import { reactive, toRaw } from "vue";
import { Consumer, Converter, Producer } from "../app-types";
import { CONSTANTS } from "../controllers/constants";
import { LOC } from "../controllers/locale";
import { levelFromExp, randomInt, randomPick, shuffle } from "../controllers/utils";
import { useBuildingsStore } from "./buildings-store";


export type DemonCreationPayload = {
    type: DemonType,
    name: string,
    experience: number,
    loyalty: number, 
    professionId: string
}

export type Profession = {
    id: string,
    experience: {
        when: 'time' | 'success',
        amount: number
    },
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

        const baseCapacity: {[key in DemonType]: number} = reactive({
            'Imp': 0,
            'Grunt': 0
        })

        const professions: {[key: string]: Profession} = {
            'Rat hunter': {
                id: 'Rat hunter',
                experience: {
                    when: 'time',
                    amount: 1
                },
                producers: [{
                    resource: 'Food',
                    description: 'Rat hunting',
                    quantity: ()=>CONSTANTS.ratHuntingFood
                }],
                consumers: [],
                converters: []
            }
        }

        const availableProfession: {[key in DemonType]: string[]} = {
            Imp: ['Rat hunter'],
            Grunt: ['Rat hunter']
        }

        const upkeeps: {[key: string]: Consumer[]} = {
            'Imp': [{
                description: LOC.consumers.upkeeps.Imp.souls,
                resource: 'Souls',
                quantity: ()=>CONSTANTS.impSoulsUpkeep
            }],
            'Grunt': []
        }

        const capacities: {[key: string]: ComputedRef<number>} = {}
        
        function getFreeName(type: DemonType) {
            const pool = namePool[type]
            shuffle(pool)

            const currentNames = demons.filter(d => d.type == type)
                                       .map(d => d.name)

            const name = pool.find(name => !currentNames.includes(name))
            return name ? name : pool[0]
        }

        function newRandomDemon(type: DemonType) {
            const creationPayload: DemonCreationPayload = {
                type,
                name: getFreeName(type),
                professionId: randomPick(availableProfession[type]),
                experience: randomInt(1, 150),
                loyalty: randomInt(30, 70),
            }

            newCustomDemon(creationPayload)
        }

        function newCustomDemon(demon: DemonCreationPayload) {
            const name = demon.name
            const professionName = demon.professionId
            
            const newDemon: Demon = {
                name, 
                type: demon.type, 
                experience: demon.experience,
                loyalty: demon.loyalty,
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
            
            newDemon.upkeep = upkeeps[demon.type].map<Consumer>(cons => { return {
                ...cons,
                quantity: () => Math.max(0.01, cons.quantity() * (newDemon.level / 3))
            }})
            
            demons.push(newDemon)
            return newDemon
        }

        Object.keys(availableProfession).forEach(dType =>
            capacities[dType] = 
                computed(()=> Object.values(buildingStore.buildingDemonCapacity)
                .flat()
                .filter((dc) => dc.demon == dType)
                .reduce((acc, dc) => acc + dc.capacity(), 
                        baseCapacity[dType as DemonType]))
        )

        function exileDemon(demon: Demon) {
            const pos = demons.indexOf(demon)
            if (pos != -1) {
                demons.splice(pos, 1)
            }
        }
        return {demons, 
                baseCapacity, 
                capacities, 
                newRandomDemon,
                newCustomDemon,
                exileDemon }
    }
)