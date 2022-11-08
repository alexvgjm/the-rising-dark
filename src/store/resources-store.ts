import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Consumer, Converter, Producer, Resource } from "../app-types";
import { useBuildingsStore } from "./buildings-store";
import { useDemonsStore } from "./demons-store";


export const useResourcesStore = defineStore(
    'resources',
    () => {
        const demonsStore = useDemonsStore()
        const buildingsStore = useBuildingsStore()
        const baseStorage = reactive<{ [key: string]: number }>({
            'Souls': 200,
            'Humans': 3,
            'Food': 100,
            'Stones': 100
        })
        
        const resources = reactive<{ [key: string]: Resource }>({
            'Souls': {
                name: 'Souls',
                description: 'Your reason for existing. Extracted from humans.',
                emoji: '🟣',
                quantity: 0,
                max: computed(()=>getStorageOf('Souls')) as unknown as number
            },
            'Humans': {
                name: 'Humans',
                description: 'Your main resource. Source of souls and fun.',
                emoji: '👨‍👩‍👧‍👦',
                quantity: 0,
                max: computed(()=>getStorageOf('Humans')) as unknown as number
            },
            'Food': {
                name: 'Food',
                description: 'To feed humans and other creatures',
                emoji: '🐀',
                quantity: 0,
                max: computed(()=>getStorageOf('Food')) as unknown as number
            },
            'Stones': {
                name: 'Stones',
                description: 'A primitive way of physically exposing our might.',
                emoji: '🪨',
                quantity: 0,
                max: computed(()=>getStorageOf('Stones')) as unknown as number
            }
        })



        const baseProducers = reactive<Producer[]>([])

        const resourcesProducingResources = reactive<{[key: string]: Producer[]}>({
            /*"Humans": [{
                description: 'Souls from humans',
                resource: 'Souls',
                quantity: () => resources['Humans'].quantity * 0.5
            }]*/
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

            const fromDemonsConsumers: Consumer[] =
                demonsStore.demons.map(d => d.profession.consumers)
                                  .flat()
                                  .filter(cons => cons.resource == resourceName)
            
            const fromDemonsUpkeeps: Consumer[] =
                demonsStore.demons.map(d => d.upkeep)
                                  .flat()
                                  .filter(cons => cons.resource == resourceName)
        
            return [...fromResources, ...fromBuildings, 
                    ...fromDemonsConsumers, ...fromDemonsUpkeeps]
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

            // DEMONS
            const fromDemons: Producer[] =
                demonsStore.demons
                           .map(d => d.profession.producers)
                           .flat()
                           .filter(prod => prod.resource == resourceName)


            return [...base, 
                    ...fromResources, 
                    ...fromBuildings,
                    ...fromDemons]
        }

        function getConvertersOf(resourceName: string): Converter[] {
            const fromBuildings = 
                Object.values(buildingsStore.buildingConverters)
                    .flat()
                    .filter(cons => resourceName in cons.inputs
                                 || resourceName in cons.outputs)
                
            return [...fromBuildings]
        }

        function getStorageOf(resourceName: string): number {
            const fromBuildings = 
                Object.values(buildingsStore.buildingStorage)
                  .flat()
                  .filter(stg => stg.resource == resourceName)
                  .reduce((acc, stg) => acc + stg.storage(), 0)
            
            
            console.log(resourceName, 
                baseStorage[resourceName], 
                fromBuildings, 'Total: ', 
                baseStorage[resourceName] + fromBuildings);
            
            return baseStorage[resourceName] + fromBuildings
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
                if (total < 0) {
                    removeResource(res, Math.abs(total) * dtFactor)
                } else if (total > 0) {
                    addResource(res, total * dtFactor)
                }
                    
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
                resource.quantity = resource.max as number
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

            getStorageOf,

            updateResources, 
            addResource,
            removeResource
        }
    }
)