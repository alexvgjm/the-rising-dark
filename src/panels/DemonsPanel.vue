<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import DemonCard from '../components/DemonCard.vue';
import { useDemonsStore } from '../store/demons-store';

const demonStore = useDemonsStore()
const imps = computed(()=>demonStore.demons.filter(d => d.type == 'Imp'))
</script>


<template>
    <section class="panel demons__category imps ">
        <header class="panel__header imps_header">
            <h1 class="panel__title">👿 Imps 1/1</h1>
        </header>

        <DemonCard v-for="imp in imps" v-bind="imp"/>
    </section>
</template>


<style>

.demons__category {
    margin-top: 1rem;
}

</style>