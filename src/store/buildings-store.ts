import { defineStore } from "pinia";
import { reactive } from "vue";
import { Building } from "../app-types";
import { calculateCost } from "../controllers/utils";
import { useResourcesStore } from "./resources-store";

export const useBuildingsStore = defineStore(
    'buildings',
    () => {
        const resStore = useResourcesStore()

        const buildings = reactive<{[key: string]: Building}>({
            'Human factory': {
                name: 'Human factory',
                description: '👨‍👩‍👧‍👦 More humans! (+0.01/s)',
                metadescription: 'Sex pools, clonation labs, storks, whatever capable to make humans.',
                level: 0,
                buildCost: [{
                    resource: 'Energy',
                    base: 10,
                    factor: 1.01
                },
                {
                    resource: 'Steel',
                    base: 25,
                    factor: 1.02
                }],
                consumption: [{
                    resource: 'Energy',
                    base: 0.1,
                    factor: 1.01
                },
                {
                    resource: 'Food',
                    base: 0.1,
                    factor: 1.01
                }],
                production: [{
                    resource: 'Humans',
                    base: 0.1,
                    factor: 1.01
                }]
            }
        })

        function isAffordable(building: Building) {
            return building.buildCost.every(cost => {
                const available = resStore.resources[cost.resource].quantity
                const currentCost = calculateCost(building.level, cost.base, cost.factor)
                return available >= currentCost
            })
        }

        function build(name: string) {
            const building = buildings[name]
            if (!isAffordable(building)) { return }
            
            building.buildCost.forEach(cost => {
                const currentCost = calculateCost(building.level, cost.base, cost.factor)
                resStore.addResource(cost.resource, -currentCost)
            })

            building.level++
        }
        return { buildings, build }
    }
)