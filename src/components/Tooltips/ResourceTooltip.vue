<script lang="ts" setup>
import { toMaxFix } from '../../controllers/utils';
import { ResourceTooltip, useTooltipsStore } from '../../store/tooltip-store';
import { useResourcesStore } from '../../store/resources-store';
import { computed } from '@vue/reactivity';

const tt = useTooltipsStore()
const resStore = useResourcesStore()
const consumers = computed(() =>
    resStore.getActiveConsumptionOf((<ResourceTooltip>tt.tooltip).resource.id)
)

const producers = computed(() =>
    resStore.getActiveProductionOf((<ResourceTooltip>tt.tooltip).resource.id)
)
</script>


<template>
    <section class="tooltip tooltip--resource" :style="{ left: tt.position.x + 'px', top: tt.position.y + 'px' }">

        <h1 class="tooltip__title" v-html="tt.tooltip.title"></h1>

        <section class="tooltip__section tooltip__description">
            {{ tt.tooltip.description }}
        </section>

        <section class="tooltip__section tooltip__producers">
            <div v-for="prod in producers" class="tooltip__resource-item tooltip__resource-item--positive">
                <span class="tooltip__producer-description" v-html="prod.description"></span>
                <span class="tooltip__producer-quantity">
                    +{{ toMaxFix(prod.quantity(), 2) }}/s</span>
            </div>
        </section>

        <section class="tooltip__section tooltip__consumers">
            <div v-for="cons in consumers" class="tooltip__resource-item tooltip__resource-item--negative">
                <span class="tooltip__consumer-description" v-html="cons.description"></span>
                <span class="tooltip__consumer-quantity">
                    -{{ toMaxFix(cons.quantity(), 2) }}/s</span>
            </div>
        </section>

        <section class="tooltip__section tooltip__metadescription">
            {{ tt.tooltip.metadescription }}
        </section>
    </section>
</template>


<style>

</style>