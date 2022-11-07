<script lang="ts" setup>
import BuildingButton from '../components/BuildingButton.vue';
import { useBuildingsStore } from '../store/buildings-store';


const buildingStore = useBuildingsStore()

</script>


<template>
    <section class="panel building">
        <header class="building__header">
            <h1>Buildings</h1>
        </header>

        <BuildingButton v-for="building in buildingStore.buildings"
                        v-bind="building"/>
    </section>
</template>


<style>
</style>