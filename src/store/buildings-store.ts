import { defineStore } from "pinia";
import { reactive } from "vue";
import { Building, Consumer, Converter, Producer, ResourceStorage } from "../app-types";
import { useResourcesStore } from "./resources-store";

export const useBuildingsStore = defineStore(
    'buildings',
    () => {
        const resStore = useResourcesStore()

        const buildings: {[key: string]: Building} = reactive<{[key: string]: Building}>({
            'Human pits': {
                name: 'Human pits',
                description: '👨‍👩‍👧‍👦 More humans! (+0.01/s) for food 🍗 (-0.25/s).',
                metadescription: 'Fork is work, porks!',
                level: 0,
                buildCost: [
                {
                    resource: 'Stones',
                    quantity: ()=>25 + 25 * buildings['Human pits'].level * 1.01,
                }]
            },
            'Jails': {
                name: 'Jails',
                description: '👨‍👩‍👧‍👦 More humans capacity! (+1 max humans)',
                metadescription: "In reality, none would try to escape, after all there is nowhere to go.",
                level: 0,
                buildCost: [{
                        resource: 'Stones',
                        quantity: ()=>10 + 10 * buildings['Jails'].level * 1.02,
                }]
            }
        })

        const buildingsProductions: {[key: string]: Producer[]} = {

        }

        const buildingConsumptions: {[key: string]: Consumer[]} = {

        }

        const buildingStorage: {[key: string]: ResourceStorage[]} = {
            'Jails': [{
                resource: 'Humans',
                storage: ()=> buildings['Jails'].level
            }]
        }

        const buildingConverters: {[key: string]: Converter[]} = {
            'Human pits': [
                {
                    multiplier: () => buildings['Human pits'].level,
                    description: 'Humans pits activity',
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
                build }
    }
)