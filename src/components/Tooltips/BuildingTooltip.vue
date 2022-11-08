<script lang="ts" setup>
import { useResourcesStore } from '../../store/resources-store';
import { useTooltipsStore } from '../../store/tooltip-store';

const tt = useTooltipsStore()
const resStore = useResourcesStore()


function isAffordable(res: string, qty: number) {
    return resStore.resources[res].quantity < qty ?
        'tooltip__cost--unaffordable': ''
}

</script>


<template>
    <section v-if="tt.visible && tt.tooltip.type == 'building'"
             class="tooltip tooltip--building"
            :style="{left: tt.position.x + 'px', top: tt.position.y + 'px'}">
        <h1 class="tooltip__title">{{tt.tooltip.title}}</h1>

        <section class="tooltip__section tooltip__description">
            {{tt.tooltip.description}}
        </section>

        <section class="tooltip__section tooltip__costs">
            <div v-for="cost in tt.tooltip.costs" 
            class="tooltip__cost"
            :class="isAffordable(cost.resource, cost.quantity())">
                <span class="tooltip__cost-resource">
                    {{resStore.resources[cost.resource].emoji!}}
                </span>
                <span class="tooltip__cost-quantity">
                    {{cost.quantity()}}
                </span>
            </div>
        </section>

        <section class="tooltip__section tooltip__metadescription">
            {{tt.tooltip.metadescription}}
        </section>
    </section>
</template>


<style>
</style>