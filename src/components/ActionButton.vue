<script lang="ts" setup>
import { ref } from 'vue';
import { getTooltipPositionForElement, remToPx } from '../controllers/utils';
import { useTooltipsStore } from '../store/tooltip-store';
import { ManualAction } from "../app-types";

const props = defineProps<ManualAction>()
defineEmits(['click'])

const ttStore = useTooltipsStore()

const button = ref<HTMLButtonElement>()


function hoveringHandler(event: {currentTarget: EventTarget | null}) {
    ttStore.showSimpleTooltip({
        type: 'simple',
        title: props.name,
        description: props.description,
        metadescription: props.metadescription,
    }, getTooltipPositionForElement(event.currentTarget as HTMLButtonElement))
}
</script>


<template>
    <button ref="button"
            @mousemove="hoveringHandler"
            @focus="hoveringHandler"
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