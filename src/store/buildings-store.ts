import { defineStore } from "pinia";
import { reactive } from "vue";
import { Building, Consumer, Converter, Producer } from "../app-types";
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
            }
        })

        const buildingsProductions: {[key: string]: Producer[]} = {

        }

        const buildingConsumptions: {[key: string]: Consumer[]} = {

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
        return { buildings, 
                buildingsProductions, 
                buildingConsumptions,
                buildingConverters,
                build }
    }
)