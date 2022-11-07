import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Building, Point, Resource } from "../app-types";
import { calculateCost, calculateProduction, toMaxFix } from "../controllers/utils";
import { useResourcesStore } from "./resources-store";

export type TooltipSectionContent = {
    classes?: string[],
    text: string
}

export type TooltipSection = {
    type: 'costs' | 'description' | 'metadescription',
    content: TooltipSectionContent[]
}

export const useTooltipsStore = defineStore(
    'tooltip',
    () => {
        const visible = ref(false)
        const title = ref('Tooltip')
        const position = ref({x: 0, y: 0})
        const sections = reactive<TooltipSection[]>([])

        const resStore = useResourcesStore()

        function showBuildingTooltip(building: Building, targetPos: Point) {
            position.value = targetPos

            title.value = building.name
            sections.length = 0

            const costsSection: TooltipSection = {
                type: 'costs',
                content: []
            }
            building.buildCost.forEach(cost => {
                const currentCost = 
                    calculateCost(building.level, cost.base, cost.factor);

                const resource = resStore.resources[cost.resource]

                costsSection.content.push({
                    classes: 
                        currentCost > resource.quantity ? ['unaffordable'] : [],
                    
                    text: resource.emoji! + ` ${currentCost}`
                })
            })

            const descSection: TooltipSection = {
                type: 'description',
                content: [{text: building.description}]
            }

            const metadescSection: TooltipSection = {
                type: 'metadescription',
                content: [{text: building.metadescription}]
            }

            sections.push(descSection, costsSection, metadescSection)
            visible.value = true
        }

        function showResourceTooltip(res: Resource, targetPos: Point) {
            position.value = targetPos

            title.value = res.emoji! + ' ' + res.name
            sections.length = 0

            const descSection: TooltipSection = {
                type: 'description',
                content: [{text: res.description}]
            }

            const producers = resStore.getProducersOf(res.name)
            const prodsSection: TooltipSection = {
                type: 'costs',
                content: producers.map(prod => {
                    const production = calculateProduction(
                        prod.level, prod.production.base, prod.production.factor
                    )
                    const prodStr = toMaxFix(production, 2)
    
                    return {
                        classes: [(production >= 0 ? 'positive' : 'negative')],
                        text: `${prod.name} (${prodStr}/s)`
                    }
                })
            }
            
            sections.push(descSection, prodsSection)

            visible.value = true
        }

        function showSimpleTooltip(
            ttTitle: string, description: string, 
            metadescription: string, targetPos: Point) {
            position.value = targetPos
            title.value = ttTitle
            sections.length = 0
            sections.push({
                type: 'description',
                content: [{text: description}]
            },
            {
                type: 'metadescription',
                content: [{text: metadescription}]
            })
            visible.value = true
        }

        function hideTooltip() {
           visible.value = false
        }

        


        return {
            visible, title, sections, position, showBuildingTooltip, 
            hideTooltip, showResourceTooltip, showSimpleTooltip
        }
    }
)