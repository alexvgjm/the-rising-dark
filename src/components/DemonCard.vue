<script lang="ts" setup>
import { computed, ref } from 'vue';
import { experienceToReachLevel, remToPx } from '../controllers/utils';
import { Demon, DemonType } from '../store/demons-store';
import { useTooltipsStore } from '../store/tooltip-store';
import ProgressBar from './ProgressBar.vue';

const props = defineProps<Demon>()

const tt = useTooltipsStore()

const demonEmojis: {[key in DemonType]: string} = {
    'Imp': '😈',
    'Grunt': '👺'
}

const profDiv = ref<HTMLElement>()

const minExp = computed(()=>experienceToReachLevel(props.level))
const maxExp = computed(()=>experienceToReachLevel(props.level+1))

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

        <ProgressBar class="demon__experience-bar"
                     :min="minExp" :max="maxExp" 
                     :current="experience">Next level</ProgressBar>

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
    margin-top: var(--space);
    min-width: 20rem;
}

.demon__profession {
    display: flex;
    justify-content: center;
    align-items: center;

    width: fit-content;
    margin-top: var(--h-space);
    font-size: var(--lesser-font-size);
    padding: var(--q-space) var(--space);
    border-radius: var(--border-radius);
    
    background: var(--color-background-darker);
    user-select: none;
}

.demon__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--h-space);
    padding-bottom: var(--h-space);
    border-bottom: var(--border-size) solid var(--color-background-darkest);
}

.demon__experience-bar {
    font-size: var(--lesser-font-size);
}

.demon__type,
.demon__level {
}
</style>