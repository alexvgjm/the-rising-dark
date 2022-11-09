<script setup lang="ts">
import { computed, ref } from '@vue/reactivity';

const props = withDefaults(defineProps<{
    current: number,
    max: number,
    min: number,
    showPercent?: boolean,
    fromZero?: boolean
}>(), {
    min: 0,
    max: 100,
    current: 0,
    showPercent: false,
    fromZero: true
})

const oMax     = computed(()=>props.max - props.min)
const oCurrent = computed(()=>props.current - props.min)
const percent  = computed(()=>
    (oCurrent.value/oMax.value * 100).toFixed(0) + '%'
)

const hovering = ref(false)

const barText = computed(()=> {
    if (hovering.value == props.showPercent) {
        return percent.value
    }

    return props.fromZero ? `${oCurrent.value} / ${oMax.value}`
                          : `${props.current} / ${props.max}`
})



</script>

<template>
    <div class="progress-bar" @mouseover="hovering = true"
                              @focus="hovering = true"
                              @mouseleave="hovering = false"
                              @blur="hovering = false">
        <div class="progress-bar__text"><slot></slot> {{barText}}</div>
        <div class="progress-bar__filler" :style="{width: percent}"></div>
    </div>
</template>

<style>
.progress-bar {
    position: relative;
    width: 100%;
    background: var(--color-progress-bar, var(--color-primary-darkest));
    padding: 0.1rem;
}
.progress-bar__text {
    position: relative;
    width: 100%;
    z-index: 1;
    text-align: center;
    color: var(--color-progress-bar__text, var(--color-primary-lightest));
}
.progress-bar__filler {
    top: 0;
    left: 0;
    height: 100%;
    position: absolute;
    background: var(--color-progress-bar__filler, var(--color-primary-dark));
    transition: 0.5s width;
}
</style>