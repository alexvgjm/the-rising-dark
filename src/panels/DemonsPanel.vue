<script lang="ts" setup>
import DemonCard from '../components/DemonCard.vue';
import { useDemonsStore } from '../store/demons-store';


const demonStore = useDemonsStore()
</script>


<template>
    <section class="panel demons">
        <header class="panel__header demons__header">
            <h1 class="panel__title">Demon servants</h1>
        </header>

        <DemonCard v-for="demon in demonStore.demons"
                   v-bind="demon"/>
    </section>
</template>


<style>

.demons {
    
}
</style>