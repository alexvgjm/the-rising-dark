<script lang="ts" setup>
import { computed } from 'vue';
import { ManualAction } from '../app-types';
import ActionButton from '../components/ActionButton.vue';
import BuildingButton from '../components/BuildingButton.vue';
import { useBuildingsStore } from '../store/buildings-store';
import { useResourcesStore } from '../store/resources-store';


const buildingStore = useBuildingsStore()

const manualActions: ManualActionAndEffect[] = [
    {
        name: '🪨 Gather stones', 
        description: 'Collect some stones from this devastated world.',
        metadescription: 'Remember that you are an overseer, not a scavenger...',
        effect: ()=>{ resStore.addResource('Stones', 1) }
    },
    {
        name: '🐀 Gather rats', 
        description: 'Collect food for humans.',
        metadescription: '',
        effect: ()=>{ resStore.addResource('Food', 1) }
    }
]

type ManualActionAndEffect = ManualAction & {effect: ()=>void}

const unlockedBuildings = computed(()=>
    Object.values(buildingStore.buildings)
          .filter(b => b.unlock)
, {onTrigger: (e)=>console.log("TRIGGER")})
const resStore = useResourcesStore()
</script>


<template>
    <section class="panel manual-actions">
        <header class="panel__header manual-actions__header">
            <h1>Manual actions</h1>
        </header>

        <ActionButton v-for="mAction in manualActions"
                          @click="mAction.effect"
                          v-bind="mAction" />
    </section>
    
    <section class="panel population">
        <header class="panel__header population__header">
            <h1>Population</h1>
        </header>

        <BuildingButton v-for="building in unlockedBuildings"
                        v-bind="building"/>

        
    </section>
</template>


<style>
</style>