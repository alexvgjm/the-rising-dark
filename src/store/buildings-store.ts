import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Building, Consumer, Converter, Producer, ResourceStorage } from "../app-types";
import { DemonCapacity } from "./demons-store";
import { useResourcesStore } from "./resources-store";
import { useStatsStore } from "./stats-store";

export const useBuildingsStore = defineStore(
    'buildings',
    () => {
        const resStore = useResourcesStore()
        const statsStore = useStatsStore()

        const buildings: {[key: string]: Building} = reactive<{[key: string]: Building}>({
            'Human pit': {
                name: 'Human pit',
                description: '👨‍👩‍👧‍👦 More humans! (+0.01/s) for food 🐀 (-0.25/s).',
                metadescription: 'Fork is work, porks!',
                level: 0,
                buildCost: [
                {
                    resource: 'Stones',
                    quantity: ()=>25 + 25 * buildings['Human pit'].level * 1.01,
                }],
                unlock: true
            },
            'Sacrificial pit': {
                name: 'Sacrificial pit',
                description: 'Sacrifice 1 👨‍👩‍👧‍👦 human every 10 seconds to get 🟣 souls.',
                metadescription: 'Today, to the pit to die!',
                level: 0,
                buildCost: [
                {
                    resource: 'Stones',
                    quantity: ()=>25 + 25 * buildings['Human pit'].level * 1.01,
                }],
                unlock: computed(()=>statsStore.achievements['First demon'].achieved) as unknown as boolean
            },
            'Jail': {
                name: 'Jail',
                description: '👨‍👩‍👧‍👦 More humans capacity! (+1 max humans)',
                metadescription: "None would try to escape, there is nowhere to go.",
                level: 0,
                buildCost: [{
                        resource: 'Stones',
                        quantity: ()=>10 + 10 * buildings['Jail'].level * 1.02,
                }],
                unlock: true
            },
            'Imp hut': {
                name: 'Imp hut',
                description: 'More 😈 Imps capacity (+1 max imps)',
                metadescription: '',
                buildCost: [{
                    resource: 'Stones',
                    quantity: ()=>80 + 50 * buildings['Imp hut'].level * 1.08
                },{
                    resource: 'Souls',
                    quantity: ()=>20 + 30 * buildings['Imp hut'].level * 1.08
                }],
                level: 0,
                unlock: computed(()=>statsStore.achievements['First demon'].achieved) as unknown as boolean
            }
        })

        const buildingsProductions: {[key: string]: Producer[]} = {

        }

        const buildingConsumptions: {[key: string]: Consumer[]} = {

        }

        const buildingStorage: {[key: string]: ResourceStorage[]} = {
            'Jail': [{
                resource: 'Humans',
                storage: ()=> buildings['Jail'].level
            }]
        }

        const buildingDemonCapacity: {[key: string]: DemonCapacity[]} = {
            'Imp hut': [{
                demon: 'Imp',
                capacity: ()=> buildings['Imp hut'].level
            }]
        }

        const buildingConverters: {[key: string]: Converter[]} = {
            'Human pit': [
                {
                    multiplier: () => buildings['Human pit'].level,
                    description: 'Human pit activity',
                    inputs: {
                        'Food': 0.25
                    },
                    outputs: {
                        'Humans': 0.1
                    }
                }
            ]
        }



        function isAffordable(building: Building) {
            return building.buildCost.every(cost => {
                const available = resStore.resources[cost.resource].quantity
                return available >= cost.quantity()
            })
        }

        function build(name: string) {
            const building = buildings[name]
            if (!isAffordable(building)) { return }
            
            building.buildCost.forEach(cost => {
                resStore.removeResource(cost.resource, cost.quantity())
            })

            building.level++
        }
        return {buildings, 
                buildingsProductions, 
                buildingConsumptions,
                buildingConverters,
                buildingStorage,
                buildingDemonCapacity,
                build }
    }
)