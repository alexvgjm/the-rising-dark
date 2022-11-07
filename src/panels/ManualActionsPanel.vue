<script lang="ts" setup>
import { ManualAction } from '../app-types';
import ActionButton from '../components/ActionButton.vue';
import { useResourcesStore } from '../store/resources-store';


type ManualActionAndEffect = ManualAction & {effect: ()=>void}
const resStore = useResourcesStore()

const manualActions: ManualActionAndEffect[] = [
    {
        name: 'Gather steel', 
        description: 'Collect some steel from this devastated world.',
        metadescription: 'Remember that you are an overseer, not a scavenger...',
        effect: ()=>{ resStore.addResource('Steel', 1) }
    },
    {
        name: 'Gather rats & maggots', 
        description: 'Collect food for humans.',
        metadescription: '',
        effect: ()=>{ resStore.addResource('Food', 1) }
    }
]
</script>

<template>
    <section class="panel manual-actions">
        <header class="manual-actions__header">
            <h1>Manual actions</h1>

            <ActionButton v-for="mAction in manualActions"
                          @click="mAction.effect"
                          v-bind="mAction" />
        </header>
    </section>
</template>


<style>
</style>