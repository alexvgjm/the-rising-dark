<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import DemonCard from '../components/DemonCard.vue';
import { LOC } from '../controllers/locale';
import { useDemonsStore } from '../store/demons-store';
import impImgURL from "../assets/icons/imp.svg";

const demonStore = useDemonsStore()
const imps = computed(()=>demonStore.demons.filter(d => d.type == 'Imp'))

</script>


<template>
    <section class="panel demons__category imps ">
        <header class="panel__header imps_header">
            <h1 class="panel__title"><img class="emoji" :src="impImgURL"> 
                {{LOC.demons.types.plural.Imps}} 
                {{imps.length}}/{{demonStore.capacities['Imp']}}
            </h1>
        </header>

        <DemonCard v-for="imp in imps" :demon="imp"/>
    </section>
</template>


<style>

.demons__category {
    margin-top: 1rem;
}

</style>