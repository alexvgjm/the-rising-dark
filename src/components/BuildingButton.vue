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
const ttStore = useTooltipsStore()
const button = ref<HTMLButtonElement>()
const enableButton = ref<HTMLButtonElement>()
const disableButton = ref<HTMLButtonElement>()

const affordable = computed(() => {
    return props.buildCost.every(cost => {
        const available = resourceStore.resources[cost.resource].quantity
        const currentCost = cost.quantity()
        return available >= currentCost
    })
})


function showEnableTooltip() {
    ttStore.showMiniTooltip(
        { text: LOC.general.ui.buildings.enable, title: '' },
        getTooltipPositionForElement(enableButton.value!, 'right')
    )
}

function showDisableTooltip() {
    ttStore.showMiniTooltip(
        { text: LOC.general.ui.buildings.disable, title: '' },
        getTooltipPositionForElement(disableButton.value!, 'right')
    )
}

function enable(evt: MouseEvent) {
    evt.stopPropagation()
    console.log("Enabling");
    
    buildingStore.enable(props.id)
}

function disable(evt: MouseEvent) {
    evt.stopPropagation()
    buildingStore.disable(props.id)
}

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
        @mouseenter="hoveringHandler" @focus="hoveringHandler" 
        @blur="ttStore.hideTooltip" @mouseleave="ttStore.hideTooltip"
        @click="clickHandler" tabindex="0" @keydown.enter="clickHandler"
        class="building-button" 
        :class="{
            'building-button--unaffordable': !affordable,
            'building-button--configurable': active !== undefined
        }">
        <span class="building-button__level">{{ active ?? level }}</span>
        <span class="building-button__name">{{ LOC.buildings[id as 'Jail'].name }}</span>

        <template v-if="level > 0 && active !== undefined">
            <button class="building-button__enable" tabindex="0"
                    :class="{'building-button__enable--cannot-enable': active === level}"
                    ref="enableButton"
                    @mouseenter="showEnableTooltip" @focus="showEnableTooltip"
                    @mouseleave="ttStore.hideMiniTooltip" 
                    @blur="ttStore.hideMiniTooltip"
                    @click="enable"
                    
            >{{ active }}</button>

            <button class="building-button__disable"
                    ref="disableButton" tabindex="0"
                    @mouseenter="showDisableTooltip" @focus="showDisableTooltip"
                    @mouseleave="ttStore.hideMiniTooltip" 
                    @blur="ttStore.hideMiniTooltip"
                    @click="disable"
                    :class="{'building-button__disable--cannot-disable': active === 0}">
                    {{ level - active }}
            </button>
        </template>
    </button>


</template>


<style>
.building-button {
    position: relative;
    background: var(--color-background-dark);
    padding: var(--x0_75-em-space) var(--x3-space);
    margin-top: 0;
    border: var(--h-em-border-size) solid var(--color-third);
    user-select: none;
    border-radius: var(--border-radius);
    text-align: center;
}



.building-button__level,
.building-button__disable,
.building-button__enable {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 0;
    top: 0;

    margin-top: 0;
    padding: 0 var(--h-space);

    background: var(--color-background-darker);
    border-radius: var(--border-radius);
}


.building-button__disable,
.building-button__enable {
    border: none;
}

.building-button__enable {
    background: var(--color-success-darky);
    color: var(--color-success-lightest);
}

.building-button__enable:hover {
    background: var(--color-success-dark);
    color: var(--color-success-lightest);
}

.building-button__disable {
    background: var(--color-danger-dark);
    color: var(--color-success-lightest);
    bottom: 0;
    top: auto;
}
.building-button__disable:hover {
    background: var(--color-danger-darky);
    color: var(--color-success-lightest);
}

.building-button__disable--cannot-disable,
.building-button__enable--cannot-enable {
    opacity: 0.7;
    pointer-events: none;
}

.building-button--unaffordable {
    background: var(--color-background-darker);
    opacity: 0.8;
    border-color: var(--color-background);
}
</style>