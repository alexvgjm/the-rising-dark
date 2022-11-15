import { defineStore } from "pinia";
import { ref } from "vue";
import { Building, Consumer, Point, Producer, Resource } from "../app-types";
import { LOC } from "../controllers/locale";
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
    building: Building,
    costs: {
        quantity: ()=>number,
        resource: string
    }[]
}

export interface ResourceTooltip extends Tooltip {
    type: 'resource'
    resource: Resource,
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
            const location = LOC.buildings[building.id as 'Jail']
            tooltip.value = {
                type: 'building',
                building,
                title: location.name,
                description: location.description,
                metadescription: location.metadescription,
                costs: building.buildCost
            }
            show(targetPos)
        }

        function showResourceTooltip(res: Resource, emoji: string, targetPos: Point) {
            position.value = targetPos

            const consumers = resStore.getConsumersOf(res.id)
            const producers = resStore.getProducersOf(res.id)
            const converters = resStore.getConvertersOf(res.id)

            converters.forEach(c => {
                if ( !resStore.canConvert(c) ) { return }
                
                consumers.push(...c.inputs.filter(c => c.resource == res.id))
                producers.push(...c.outputs.filter(p => p.resource == res.id))
            })
            
            tooltip.value = {
                type: 'resource',
                resource: res,
                                      //FIXME: cast as 'Souls' because typing...
                title: emoji + ' ' +LOC.resources[res.id as 'Souls'].name,
                description: LOC.resources[res.id as 'Souls'].description,
                metadescription: LOC.resources[res.id as 'Souls'].metadescription,
                consumers: consumers,
                producers: producers
            }
            
            show(targetPos)
        }

        function showSimpleTooltip(params: {
            title: string, description: string, metadescription: string
        }, targetPos: Point) {
            tooltip.value = {type: "simple", ...params}
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