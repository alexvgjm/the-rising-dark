import { defineStore } from "pinia";
import { reactive } from "vue";
import { Consumer, Converter, Producer, Resource, RPR } from "../app-types";
import { calculateProduction } from "../controllers/utils";
import { useBuildingsStore } from "./buildings-store";






export const useResourcesStore = defineStore(
    'resources',
    () => {
        const buildingsStore = useBuildingsStore()
        const resources = reactive<{ [key: string]: Resource }>({
            'Souls': {
                name: 'Souls',
                description: 'Your reason for existing. Extracted from humans.',
                emoji: '🟣',
                quantity: 5,
                max: 200
            },
            'Humans': {
                name: 'Humans',
                description: 'Your main resource. Source of souls and fun.',
                emoji: '👨‍👩‍👧‍👦',
                quantity: 0,
                max: 3
            },
            'Food': {
                name: 'Food',
                description: 'To feed humans and other organisms.',
                emoji: '🍗',
                quantity: 0,
                max: 100
            },
            'Stones': {
                name: 'Stones',
                description: 'A primitive way of physically exposing our might.',
                emoji: '🪨',
                quantity: 0,
                max: 100
            }
        })

        const baseProducers = reactive<Producer[]>([
            {
                description: 'Base souls',
                resource: 'Souls', 
                quantity: ()=>1
            }
        ])

        const resourcesProducingResources = reactive<{[key: string]: Producer[]}>({
            "Humans": [{
                description: 'Souls from humans',
                resource: 'Souls',
                quantity: () => resources['Humans'].quantity * 0.5
            }]
        })

        const resourcesConsumingResources = reactive<{[key: string]: Consumer[]}>({
            "Humans": [{
                description: 'Human food consumption',
                resource: 'Food',
                quantity: () => resources['Humans'].quantity * 0.25
            }]
        })

        function getConsumersOf(resourceName: string): Consumer[] {
            const fromResources = 
                Object.values(resourcesConsumingResources)
                      .flat()
                      .filter(cons => cons.resource == resourceName)

            const fromBuildings = 
                Object.values(buildingsStore.buildingConsumptions)
                      .flat()
                      .filter(cons => cons.resource == resourceName)

                
            return [...fromResources, ...fromBuildings]
        }

        function getProducersOf(resourceName: string): Producer[] {
            const producers: Producer[] = []
            
            // BASE PRODUCERS
            const base: Producer[] = 
                baseProducers.filter(p => p.resource == resourceName)

            // RESOURCES PRODUCING RESOURCES
            const fromResources = 
                Object.values(resourcesProducingResources)
                      .flat()
                      .filter(prod => prod.resource == resourceName)
            
            // BUILDINGS
            const fromBuildings = 
                Object.values(buildingsStore.buildingsProductions)
                      .flat()
                      .filter(prod => prod.resource == resourceName)

            return [...base, ...fromResources, ...fromBuildings]
        }

        function getConvertersOf(resourceName: string): Converter[] {
            const fromBuildings = 
                Object.values(buildingsStore.buildingConverters)
                    .flat()
                    .filter(cons => resourceName in cons.inputs
                                 || resourceName in cons.outputs)
                
            return [...fromBuildings]
        }

        function canConvert(converter: Converter) {
            const canAfford = Object
                .entries(converter.inputs)
                .every(([resName, qty]) =>
                     resources[resName].quantity >= 
                        qty * converter.multiplier()
                )

            const notMaximumOutput = Object
                .entries(converter.outputs)
                .some(([resName, qty]) =>{
                    return resources[resName].quantity < resources[resName].max
                })

            return canAfford && notMaximumOutput
        }

        function getTotalProductionOf(resource: string) {
            const prods = getProducersOf(resource)
            const consu = getConsumersOf(resource)

            const totalProd = prods.reduce((acc, p) => acc + p.quantity(), 0)
            const totalCons = consu.reduce((acc, c) => acc + c.quantity(), 0)

            return totalProd - totalCons
        }

        function updateResources(delta: number) {
            const dtFactor = delta/1000
            
            Object.keys(resources).forEach(res => {
                const total = getTotalProductionOf(res)
                total < 0 ? removeResource(res, Math.abs(total) * dtFactor)
                          : addResource(res, total * dtFactor)
                    
                const converters = getConvertersOf(res)
                converters.forEach(c => {
                    if (canConvert(c)) {
                        Object.entries(c.inputs).forEach(([resName, qty]) => {
                            removeResource(resName, qty*c.multiplier()*dtFactor)
                        })
                        Object.entries(c.outputs).forEach(([resName, qty]) => {
                            addResource(resName, qty*c.multiplier()*dtFactor)
                        })
                    }
                })
            })

        }

        function addResource(name: string, quantity: number) {
            const resource = resources[name]
            resource.quantity += quantity

            if(resource.quantity > resource.max) { 
                resource.quantity = resource.max
            }
        }

        function removeResource(name: string, quantity: number) {
            const resource = resources[name]
            resource.quantity -= quantity

            if(resource.quantity < 0) { resource.quantity = 0 }
        }

        return {
            resources, 
            baseProducers,

            getProducersOf,
            getConsumersOf,
            getConvertersOf,
            canConvert,

            updateResources, 
            addResource,
            removeResource
        }
    }
)