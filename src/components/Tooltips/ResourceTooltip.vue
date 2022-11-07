<script lang="ts" setup>
import { toMaxFix } from '../../controllers/utils';
import { useTooltipsStore, ResourceTooltip } from '../../store/tooltip-store';

const tt = useTooltipsStore()

</script>


<template>
    <section v-if="tt.visible && tt.tooltip.type == 'resource'"
            class="tooltip tooltip--resource"
            :style="{left: tt.position.x + 'px', top: tt.position.y + 'px'}">
        <h1 class="tooltip__title">{{tt.tooltip.title}}</h1>

        <section class="tooltip__section tooltip__description">
            {{tt.tooltip.description}}
        </section>

        <section class="tooltip__section tooltip__producers">
            <div v-for="prod in tt.tooltip.producers" 
                class="tooltip__resource-item tooltip__resource-item--positive">
                <span class="tooltip__producer-description">{{prod.description}}</span>
                <span class="tooltip__producer-quantity">{{toMaxFix(prod.quantity(), 2)}}/s</span>
            </div>
        </section>

        <section class="tooltip__section tooltip__consumers">
            <div v-for="cons in tt.tooltip.consumers.filter(c => c.quantity() != 0)" 
                class="tooltip__resource-item tooltip__resource-item--negative">
                <span class="tooltip__consumer-description">{{cons.description}}</span>
                <span class="tooltip__consumer-quantity">-{{toMaxFix(cons.quantity(), 2)}}/s</span>
            </div>
        </section>

        <section class="tooltip__section tooltip__metadescription">
            {{tt.tooltip.metadescription}}
        </section>
    </section>
</template>


<style>

</style>