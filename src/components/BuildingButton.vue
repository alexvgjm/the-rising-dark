<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Building } from '../app-types';
import { calculateCostByLevel, remToPx } from '../controllers/utils';
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
    const bRect = button.value!.getBoundingClientRect()

    const position = {
        x: bRect.left - (remToPx(20) - bRect.width) / 2,
        y: bRect.bottom + 10 - button.value!.scrollTop
    }
    ttStore.showBuildingTooltip(props, position)
}

function clickHandler() {
    if (affordable) { 
        buildingStore.build(props.name)
        hoveringHandler()
    }
}
</script>


<template>
    <button ref="button"
            @mousemove="hoveringHandler"
            @focus="hoveringHandler"
            @blur="ttStore.hideTooltip"
            @mouseleave="ttStore.hideTooltip"
            @click="clickHandler"
            class="building-button" :class="{
                'building-button--unaffordable': !affordable
            }">
        <span class="building-button__level">{{level}}</span>
        <span class="building-button__name">{{name}}</span>
    </button>
</template>


<style>
.building-button {
    padding: var(--em-space) var(--x2-space);
    position: relative;
    margin-right: var(--space);
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