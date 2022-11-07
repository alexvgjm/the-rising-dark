import { defineStore } from "pinia";
import { reactive } from "vue";
import { Producer, Resource } from "../app-types";
import { calculateProduction } from "../controllers/utils";
import { useBuildingsStore } from "./buildings-store";

export const useResourcesStore = defineStore(
    'resources',
    () => {
        const buildingsStore = useBuildingsStore()
        const resources = reactive<{ [key: string]: Resource }>({
            'Energy': {
                name: 'Energy',
                description: 'Your reason for existing. Extracted from humans.',
                emoji: '⚡',
                quantity: 5,
                max: 200
            },
            'Humans': {
                name: 'Humans',
                description: 'Your main resource. Source of energy and fun.',
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
            'Steel': {
                name: 'Steel',
                description: 'A primitive way of physically exposing our might.',
                emoji: '🔩',
                quantity: 0,
                max: 100
            }
        })


        const baseProducers = reactive<Producer[]>([
            {
                name: 'Base',
                level: 1,
                production: { resource: 'Energy', base: 1, factor: 1 }
            }
        ])

        function getProducersOf(resource: string) {
            const producers: Producer[] = []
            
            producers.push(
                ...baseProducers.filter(p => p.production.resource == resource)
            )

            const buildingsProducingTheResource = 
                Object.values(buildingsStore.buildings)
                      .filter(b => b.production && b.level > 0 && b.production
                                    .some(p => p.resource == resource))
            
            buildingsProducingTheResource.forEach(b => {
                const bProds: Producer[] = b.production!
                                          .filter(p => p.resource == resource)
                                          .map(p => {return {
                                            name: b.name,
                                            level: b.level,
                                            production: p
                                          }})
            
                producers.push(...bProds)
            })

            return producers
        }

        function updateResources(delta: number) {
            const dtFactor = delta/1000
            
            Object.values(resources).forEach((resource) => {
                const producers = getProducersOf(resource.name)
                producers.forEach(prod => {
                    const production = calculateProduction(
                        prod.level, 
                        prod.production.base, 
                        prod.production.factor)

                    if (production != 0) {
                        addResource(resource.name, production * dtFactor)
                    }
                })
            })
        }

        function addResource(name: string, quantity: number) {
            const resource = resources[name]
            resource.quantity += quantity

            if(name != 'Energy')
                console.log(`Adding ${quantity} to ${name}. Total: ${resource.quantity}`);
            
            if(resource.quantity > resource.max) { 
                resource.quantity = resource.max
            }
        }

        return { 
            resources, 
            producers: baseProducers, 
            getProducersOf, 
            updateResources, 
            addResource 
        }
    }
)