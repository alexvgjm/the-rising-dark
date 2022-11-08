import { defineStore } from "pinia";
import { ref } from "vue";
import { Building, Consumer, Point, Producer, Resource } from "../app-types";
import { useResourcesStore } from "./resources-store";

export type TooltipSectionContent = {
    classes?: string[],
    text: string
}

interface Tooltip {
    type: 'simple' | 'building' | 'resource'
    title: string
    description: string,
    metadescription: string,
}

export interface SimpleTooltip extends Tooltip {
    type: 'simple'
}

export interface BuildingTooltip extends Tooltip {
    type: 'building'
    costs: {
        quantity: ()=>number,
        resource: string
    }[]
}

export interface ResourceTooltip extends Tooltip {
    type: 'resource'
    producers: Producer[],
    consumers: Consumer[]
}

export const useTooltipsStore = defineStore(
    'tooltip',
    () => {
        const resStore = useResourcesStore()

        const tooltip = ref<SimpleTooltip|BuildingTooltip|ResourceTooltip>({
            type: 'simple',
            title: 'Tooltip',
            description: '',
            metadescription: ''
        })

        const visible = ref(false)
        const position = ref({x: 0, y: 0})

        function show(targetPosition: Point) {
            position.value = targetPosition
            visible.value = true
        }

        function showBuildingTooltip(building: Building, targetPos: Point) {
            tooltip.value = {
                type: 'building',
                title: building.name,
                description: building.description,
                metadescription: building.metadescription,
                costs: building.buildCost
            }
            show(targetPos)
        }

        function showResourceTooltip(res: Resource, targetPos: Point) {
            position.value = targetPos

            const consumers = resStore.getConsumersOf(res.name)
            const producers = resStore.getProducersOf(res.name)
            const converters = resStore.getConvertersOf(res.name)

            converters.forEach(c => {
                if ( !resStore.canConvert(c) ) { return }
                
                Object.entries(c.inputs).forEach(([cResName, qty]) =>{
                    
                    if (cResName != res.name || qty*c.multiplier() == 0) return
                    consumers.push({
                        description: c.description,
                        resource: cResName,
                        quantity: ()=>qty*c.multiplier()
                    })
                })

                Object.entries(c.outputs).forEach(([cResName, qty]) =>{
                    if (cResName != res.name || qty*c.multiplier() == 0) return
                    producers.push({
                        description: c.description,
                        resource: cResName,
                        quantity: ()=>qty*c.multiplier()
                    })
                })
            })
            
            tooltip.value = {
                type: 'resource',
                title: res.emoji! + ' ' + res.name,
                description: res.description,
                metadescription: '',
                consumers: consumers,
                producers: producers
            }
            
            show(targetPos)
        }

        function showSimpleTooltip(params: SimpleTooltip, targetPos: Point) {
            tooltip.value = {...params}
            show(targetPos)
        }

        function hideTooltip() {
           visible.value = false
        }

        return {
            tooltip, visible, position,
            showBuildingTooltip, hideTooltip, showResourceTooltip,
            showSimpleTooltip
        }
    }
)