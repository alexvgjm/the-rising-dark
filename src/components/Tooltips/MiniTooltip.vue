<script lang="ts" setup>
import './tooltips.css'
import { useTooltipsStore } from '../../store/tooltip-store';

const tt = useTooltipsStore()
</script>


<template>
    <section class="tooltip tooltip--mini"
            :style="{left: tt.miniposition.x + 'px', top: tt.miniposition.y + 'px'}">
        <h1 v-if="tt.minitooltip.title"
            class="tooltip__title" 
            v-html="tt.minitooltip.title"></h1>

        <section class="tooltip__section tooltip__description"
                 v-html="tt.minitooltip.text">
        </section>
    </section>
</template>


<style>
.tooltip--mini {
    padding: var(--q-space) var(--space);
    min-width: 0;
    max-width: 20rem;
    width: fit-content;
    border-radius: var(--border-radius);
}

.tooltip--mini .tooltip__section:first-child {
    border: none;
    margin-top: 0;
}

.tooltip--mini .tooltip__title {
    font-size: var(--biggy-font-size);
}
</style>