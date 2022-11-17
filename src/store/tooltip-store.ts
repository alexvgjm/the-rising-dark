import { defineStore } from "pinia";
import { computed, ComputedRef, ref } from "vue";
import { Building, Consumer, Point, Producer, Resource } from "../app-types";
import { AVAILABLE_EMOJIS, parseEmojis } from "../controllers/emoji";
import { LOC } from "../controllers/locale";
import { Demon } from "./demons-store";
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

export interface MiniTooltip {
    title: string,
    text: string
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

        const minitooltip = ref<MiniTooltip>({
            text: '',
            title: ''
        })

        const tooltip = ref<SimpleTooltip|BuildingTooltip|ResourceTooltip>({
            type: 'simple',
            title: 'Tooltip',
            description: '',
            metadescription: ''
        })

        const visible = ref(false)
        const position = ref({x: 0, y: 0})
        const miniposition = ref({x: 0, y: 0})

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

            const consumers = computed(() =>
                resStore.getActiveConsumptionOf(res.id)
            )
            const producers = computed(() =>
                resStore.getActiveProductionOf(res.id)
            )

            tooltip.value = {
                type: 'resource',
                resource: res,
                                      //FIXME: cast as 'Souls' because typing...
                title: emoji + ' ' +LOC.resources[res.id as 'Souls'].name,
                description: LOC.resources[res.id as 'Souls'].description,
                metadescription: LOC.resources[res.id as 'Souls'].metadescription,
                consumers: consumers as unknown as Consumer[],
                producers: producers as unknown as Producer[]
            }
            
            show(targetPos)
        }

        function showSimpleTooltip(params: {
            title: string, description: string, metadescription: string
        }, targetPos: Point) {
            tooltip.value = {type: "simple", ...params}
            show(targetPos)
        }

        function showUpkeepTooltip(demon: Demon, targetPos: Point) {
            tooltip.value = {
                type: "resource",
                resource: resStore.resources['Souls'], // dummy
                description: LOC.general.ui.demon.upkeepDescription,
                title: LOC.general.ui.demon.upkeep,
                consumers: demon.upkeep.map((c) => {
                    return {
                        ...c,
                        description: parseEmojis(AVAILABLE_EMOJIS[c.resource]) 
                                    + " " + LOC.resources[c.resource as 'Souls'].name
                    }
                }),
                metadescription: '',
                producers: [] // dummy
            }
            show(targetPos)
        }

        function showMiniTooltip(params: MiniTooltip, targetPos: Point) {
            miniposition.value = targetPos
            minitooltip.value = params
        }

        function hideMiniTooltip() {
            minitooltip.value.text = ''
        }

        function hideTooltip() {
            visible.value = false
        }

        return {
            tooltip, visible, position, minitooltip, miniposition,
            showBuildingTooltip, hideTooltip, showResourceTooltip,
            showSimpleTooltip, showUpkeepTooltip, showMiniTooltip, 
            hideMiniTooltip
        }
    }
)