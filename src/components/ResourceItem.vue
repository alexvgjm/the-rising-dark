<script lang="ts" setup>
import { Resource } from '../app-types';
import { useTooltipsStore } from '../store/tooltip-store';

const props = defineProps<Resource>()

const safename = props.name.toLowerCase().replaceAll(' ', '-');
const textColor = `var(--color-resource-${safename})`

const ttStore = useTooltipsStore()

const imgSrc =
    new URL(`/src/assets/icons/${safename}.svg`, import.meta.url).href

function mouseMoveHandler(event: MouseEvent) {
    const position = {
        x: event.clientX + 10,
        y: event.clientY + 10
    }
    ttStore.showResourceTooltip(props, position)
}
</script>


<template>
    <div @mousemove="mouseMoveHandler" 
         @mouseleave="ttStore.hideTooltip"
        class="resource" 
        :style="{ color: textColor }">
        <img v-if="!emoji" :src="imgSrc" :alt="`Resource icon for ${name}`">
        <i v-else class="resource__icon">{{ emoji }}</i>
        <span class="resource__quantity">
            {{ Math.floor(quantity).toFixed() }} / {{ max }}
        </span>
    </div>
</template>

<style>
.resource {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: var(--h-space);
    border-bottom: var(--border-size) solid var(--color-background-darker);
}

.resource__icon {
    font-style: normal;
    width: var(--x2-space);
    height: var(--x2-space);
    display: flex;
    justify-content: center;
    align-items: center;
}

.resource__quantity {
    margin-left: auto;
}
</style>