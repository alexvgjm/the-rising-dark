<script lang="ts" setup>
import { ref } from 'vue';
import { remToPx } from '../controllers/utils';
import { useTooltipsStore } from '../store/tooltip-store';
import { ManualAction } from "../app-types";

const props = defineProps<ManualAction>()
defineEmits(['click'])

const ttStore = useTooltipsStore()

const button = ref<HTMLButtonElement>()

function mouseOverHandler(event: MouseEvent) {
    const position = {
        x: event.clientX + 10,
        y: event.clientY + 10
    }
    ttStore.showSimpleTooltip(
        props.name, props.description, props.metadescription, position)
}

function focusHandler(event: FocusEvent) {
    const button = event.target as HTMLButtonElement
    const bRect = button.getBoundingClientRect()

    const position = {
        x: bRect.left - (remToPx(20) - bRect.width) / 2,
        y: bRect.bottom + 10 - button.scrollTop
    }
    ttStore.showSimpleTooltip(
        props.name, props.description, props.metadescription, position)
}
</script>


<template>
    <button ref="button"
            @mousemove="mouseOverHandler"
            @focus="(event)=>focusHandler(event)"
            @blur="ttStore.hideTooltip"
            @mouseleave="ttStore.hideTooltip"
            @click="$emit('click')"
            class="action-button" :class="{}">
        <span class="action-button__name">{{name}}</span>
    </button>
</template>


<style>
.action-button {
    padding: var(--h-em-space) var(--x1_5-em-space);
    position: relative;
    margin-right: var(--space);
}

.action-button__level {
    position: absolute;
    right: 0;
    top: 0;
    background: var(--color-background-darker);
    padding: 0 var(--h-space);
    border-radius: var(--border-radius);
}

.action-button--unaffordable {
    opacity: 0.5;
}

</style>