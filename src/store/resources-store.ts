import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Consumer, Converter, Producer, Resource } from "../app-types";
import { LOC } from "../controllers/locale";
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
            'Stones': 1000
        })
        
        const resources = reactive<{ [key: string]: Resource }>({
            'Souls': {
                id: 'Souls',
                quantity: 0,
                max: computed(()=>getStorageOf('Souls')) as unknown as number
            },
            'Humans': {
                id: 'Humans',
                quantity: 0,
                max: computed(()=>getStorageOf('Humans')) as unknown as number
            },
            'Food': {
                id: 'Food',
                quantity: 0,
                max: computed(()=>getStorageOf('Food')) as unknown as number
            },
            'Stones': {
                id: 'Stones',
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
                description: LOC.consumers.resources['Humans'],
                resource: 'Food',
                quantity: () => Math.floor(resources['Humans'].quantity) * 0.25
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
        /**
         * Same as getConsumersOf but including only not 0 consumers and
         * converter consumers.
         */
        function getActiveConsumptionOf(resId: string): Consumer[] {
            const directConsume = getConsumersOf(resId)
                                    .filter(c => c.quantity() != 0)

            const converterConsumers = getConvertersOf(resId)
                                        .filter(conv => canConvert(conv))
                                        .map(conv => conv.inputs)
                                        .flat()
                                        .filter(c => c.resource == resId &&
                                                     c.quantity() != 0)

            return [...directConsume, ...converterConsumers]
        }

        /**
         * Same as getProducersOf but including only not 0 Producers and
         * converter Producers.
         */
        function getActiveProductionOf(resId: string): Consumer[] {
            const directProduction = getProducersOf(resId)
                                    .filter(c => c.quantity() != 0)

            const converterProducers = getConvertersOf(resId)
                                        .filter(conv => canConvert(conv))
                                        .map(conv => conv.outputs)
                                        .flat()
                                        .filter(p => p.resource == resId &&
                                                     p.quantity() != 0)

            return [...directProduction, ...converterProducers]
        }

        function getConvertersOf(resourceName: string): Converter[] {
            const fromBuildings = 
                Object.values(buildingsStore.buildingConverters)
                .flat()
                .filter(conv => 
                    conv.inputs.some(cons => cons.resource == resourceName)
                 || conv.outputs.some(prod => prod.resource == resourceName))
                
            
            return [...fromBuildings]
        }

        function getStorageOf(resourceName: string): number {
            const fromBuildings = 
                Object.values(buildingsStore.buildingStorage)
                  .flat()
                  .filter(stg => stg.resource == resourceName)
                  .reduce((acc, stg) => acc + stg.storage(), 0)
            
            return baseStorage[resourceName] + fromBuildings
        }
        

        function canConvert(converter: Converter) {
            const canAfford = converter.inputs
                .every(({resource, quantity}) =>
                     resources[resource].quantity >= quantity()
                )

            const notMaximumOutput = converter.outputs
                .some(({resource: res}) =>
                    resources[res].max >resources[res].quantity
                )

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
                        c.inputs.forEach(cons => removeResource (
                            cons.resource, 
                            cons.quantity()*dtFactor
                        ))

                        c.outputs.forEach(prod => addResource (
                            prod.resource, 
                            prod.quantity()*dtFactor
                        ))
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
            getActiveConsumptionOf,
            getActiveProductionOf,
            canConvert,

            getStorageOf,

            updateResources, 
            addResource,
            removeResource
        }
    }
)