<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Building } from '../app-types';
import { LOC } from '../controllers/locale';
import { getTooltipPositionForElement } from '../controllers/utils';
import { useBuildingsStore } from '../store/buildings-store';
import { useResourcesStore } from '../store/resources-store';
import { useTooltipsStore } from '../store/tooltip-store';

const props = defineProps<Building>()

const buildingStore = useBuildingsStore()
const resourceStore = useResourcesStore()
const ttStore       = useTooltipsStore()

const button = ref<HTMLButtonElement>()

const affordable = computed(()=>{
    return props.buildCost.every(cost => {
        const available = resourceStore.resources[cost.resource].quantity
        const currentCost = cost.quantity()
        return available >= currentCost
    })
})

function hoveringHandler() {
    ttStore.showBuildingTooltip(
        props, 
        getTooltipPositionForElement(button.value!)
    )
}

function clickHandler() {
    if (affordable) {
        buildingStore.build(props.id)
        hoveringHandler()
    }
}
</script>


<template>
    <button ref="button"
            @mouseenter="hoveringHandler"
            @focus="hoveringHandler"
            @blur="ttStore.hideTooltip"
            @mouseleave="ttStore.hideTooltip"
            @click="clickHandler"
            class="building-button" :class="{
                'building-button--unaffordable': !affordable
            }">
        <span class="building-button__level">{{level}}</span>
        <span class="building-button__name">{{LOC.buildings[id as 'Jail'].name}}</span>
    </button>
</template>


<style>
.building-button {
    position: relative;
    padding: var(--h-em-space) var(--x3-space);
    margin-top: 0;
}

.building-button__level {
    position: absolute;
    right: 0;
    top: 0;
    background: var(--color-background-darker);
    padding: 0 var(--h-space);
    border-radius: var(--border-radius);
}

.building-button--unaffordable {
    opacity: 0.5;
}

</style>