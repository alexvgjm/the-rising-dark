import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Building, Consumer, Converter, Producer, ResourceStorage } from "../app-types";
import { CONSTANTS } from "../controllers/constants";
import { LOC } from "../controllers/locale";
import { DemonCapacity } from "./demons-store";
import { useResourcesStore } from "./resources-store";
import { useStatsStore } from "./stats-store";

export const useBuildingsStore = defineStore(
    'buildings',
    () => {
        const resStore = useResourcesStore()
        const statsStore = useStatsStore()

        const buildings: { [key: string]: Building } = reactive<{ [key: string]: Building }>({
            'Human pit': {
                id: 'Human pit',
                type: 'resources',
                level: 0,
                active: 0,
                buildCost: [{
                    resource: 'Stones',
                    quantity: () =>
                        Math.floor(250 + 250 * buildings['Human pit'].level ** 1.05),
                }],
                unlock: true
            },
            'Sacrificial pit': {
                id: 'Sacrificial pit',
                type: 'resources',
                level: 0,
                active: 0,
                buildCost: [{
                    resource: 'Stones',
                    quantity: () =>
                        Math.floor(250 + 250 * buildings['Sacrificial pit'].level! ** 1.05),
                },{
                    resource: 'Bones',
                    quantity: () =>
                        Math.floor(250 + 250 * buildings['Sacrificial pit'].level ** 1.05),
                }],
                unlock: computed(() => statsStore.achievements['First demon'].achieved) as unknown as boolean
            },
            'Jail': {
                id: 'Jail',
                type: 'population',
                level: 0,
                buildCost: [{
                    resource: 'Stones',
                    quantity: () =>
                        Math.floor(25 + 25 * buildings['Jail'].level ** 1.05),
                },
                {
                    resource: 'Bones',
                    quantity: () =>
                        Math.floor(100 + 100 * buildings['Jail'].level ** 1.05),
                }],
                unlock: true
            },
            'Imp hut': {
                id: 'Imp hut',
                type: 'population',
                level: 0,
                buildCost: [{
                    resource: 'Stones',
                    quantity: () => Math.floor(
                        400 + 1000 * buildings['Imp hut'].level**1.12 * 3
                    )
                }, 
                {
                    resource: 'Bones',
                    quantity: () => Math.floor(
                        400 + 1000 * buildings['Imp hut'].level**1.12 * 3
                    )
                },{
                    resource: 'Souls',
                    quantity: () => Math.floor(
                        20 + 80 * buildings['Imp hut'].level**1.12 *3
                    )
                }],
                unlock: computed(() => statsStore.achievements['First demon'].achieved) as unknown as boolean
            }
        })

        const buildingsProductions: { [key: string]: Producer[] } = {}
        const buildingConsumptions: { [key: string]: Consumer[] } = {}
        const buildingConverters: { [key: string]: Converter[] } = {
            'Human pit': [
                {
                    id: 'Human pit',
                    inputs: [{
                        resource: 'Food',
                        quantity: ()=>CONSTANTS.humanPitFood * buildings['Human pit'].active!,
                        description: LOC.consumers.buildings['Human pit']
                    }],
                    outputs: [{
                        resource: 'Humans',
                        quantity: ()=>CONSTANTS.humanPitHumans * buildings['Human pit'].active!,
                        description: LOC.consumers.buildings['Human pit']
                    }]
                }
            ],
            'Sacrificial pit': [
                {
                    id: 'Sacrificial pit',
                    inputs: [{
                        resource: 'Humans',
                        quantity: ()=>buildings['Sacrificial pit'].active! * 0.1,
                        description: LOC.consumers.buildings['Sacrificial pit']
                    }],
                    outputs: [{
                        resource: 'Souls',
                        quantity: ()=>buildings['Sacrificial pit'].active! * 0.1,
                        description: LOC.consumers.buildings['Sacrificial pit']
                    },
                    {
                        resource: 'Bones',
                        quantity: ()=>buildings['Sacrificial pit'].active! * 0.4,
                        description: LOC.consumers.buildings['Sacrificial pit']
                    }]
                }
            ]
        }

        const buildingStorage: { [key: string]: ResourceStorage[] } = {
            'Jail': [{
                resource: 'Humans',
                storage: () => buildings['Jail'].level
            }]
        }

        const buildingDemonCapacity: { [key: string]: DemonCapacity[] } = {
            'Imp hut': [{
                demon: 'Imp',
                capacity: () => buildings['Imp hut'].level
            }]
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
            if (building.active !== undefined) { building.active++ }
        }

        function enable(id: string) {
            const b = buildings[id]
            if (b.active === undefined) { return }
            b.active = Math.min(b.active + 1, b.level)
        }
        function disable(id: string) {
            const b = buildings[id]
            if (b.active === undefined) { return }
            b.active = Math.max(b.active - 1, 0)
        }
        return {
            buildings,
            buildingsProductions,
            buildingConsumptions,
            buildingConverters,
            buildingStorage,
            buildingDemonCapacity,
            build,
            enable,
            disable
        }
    }
)