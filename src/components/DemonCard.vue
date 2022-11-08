<script lang="ts" setup>
import { ref } from 'vue';
import { remToPx } from '../controllers/utils';
import { Demon, DemonType } from '../store/demons-store';
import { useTooltipsStore } from '../store/tooltip-store';

const props = defineProps<Demon>()

const tt = useTooltipsStore()

const demonEmojis: {[key in DemonType]: string} = {
    'Imp': '😈',
    'Grunt': '👺'
}

const profDiv = ref<HTMLElement>()

function professionHover() {
    const bRect = profDiv.value!.getBoundingClientRect()

    const position = {
        x: bRect.left - (remToPx(20) - bRect.width) / 2,
        y: bRect.bottom + 10 - profDiv.value!.scrollTop
    }
    tt.showSimpleTooltip({
        type: 'simple',
        title: props.profession.name,
        description: props.profession.description,
        metadescription: props.profession.metadescription,
    }, position)
}
</script>


<template>
    <article class="demon">
        <header class="demon__header">
            <h1 class="demon__name">{{demonEmojis[type]}} {{name}}</h1>
            <div class="demon__type">{{type}} <span class="demon__level">Level {{level}}</span></div>
        </header>
        <div class="demon__profession" ref="profDiv"
             @mousemove="professionHover"
             @focus="professionHover"
             @mouseleave="tt.hideTooltip"
             @blur="tt.hideTooltip">
            {{profession.name}}
        </div>
    </article>
</template>


<style>
.demon {
    display: flex;
    flex-flow: column;
    width: fit-content;
    padding: var(--space);
    box-shadow: var(--default-box-shadow);
    background: var(--color-background);
    border-radius: var(--border-radius);
}

.demon__profession {
    background: var(--color-background-darker);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--q-space) var(--space);
    user-select: none;
    border-radius: var(--border-radius);
}

.demon__header {
    margin-bottom: var(--h-space);
    padding-bottom: var(--h-space);
    border-bottom: var(--border-size) solid var(--color-background-darkest);
}

.demon__type,
.demon__level {
}
</style>