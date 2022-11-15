<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { Resource } from '../app-types';
import { LOC } from '../controllers/locale';
import { getTooltipPositionForElement } from '../controllers/utils';
import { AVAILABLE_EMOJIS, parseEmojis } from '../controllers/emoji';
import { useTooltipsStore } from '../store/tooltip-store';

const props = defineProps<Resource>()

                // FIXME: because typing...
const name = computed(()=>LOC.resources[props.id as 'Souls'].name)
const safename = props.id.toLowerCase().replaceAll(' ', '-');
const textColor = `var(--color-resource-${safename})`

const ttStore = useTooltipsStore()
const resDiv = ref()


const emoji = computed(()=>parseEmojis(AVAILABLE_EMOJIS[props.id]))

function resourceHover() {
    ttStore.showResourceTooltip(
        props, emoji.value, getTooltipPositionForElement(resDiv.value)
    )
}
</script>


<template>
    <div ref="resDiv" @mouseenter="resourceHover" @focus="resourceHover" 
         @mouseleave="ttStore.hideTooltip" @blur="ttStore.hideTooltip"
        tabindex="1"
        class="resource" 
        :style="{ color: textColor }">
        <i class="resource__icon" v-html="emoji"></i>
        <span class="resource__name">{{name}}</span>
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

@media (max-width: 1024px) {
    .resource__name {
        display: none;
    }
}
</style>