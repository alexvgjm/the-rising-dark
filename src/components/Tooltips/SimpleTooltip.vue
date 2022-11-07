<script lang="ts" setup>
import './tooltips.css'
import { useTooltipsStore } from '../../store/tooltip-store';

const tt = useTooltipsStore()
</script>


<template>
    <section v-if="tt.visible && tt.tooltip.type == 'simple'"
            class="tooltip tooltip--simple"
            :style="{left: tt.position.x + 'px', top: tt.position.y + 'px'}">
        <h1 class="tooltip__title">{{tt.tooltip.title}}</h1>

        <section class="tooltip__section tooltip__description">
            {{tt.tooltip.description}}
        </section>

        <section class="tooltip__section tooltip__metadescription">
            {{tt.tooltip.metadescription}}
        </section>
    </section>
</template>


<style>

</style>