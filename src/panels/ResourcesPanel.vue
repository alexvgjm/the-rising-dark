<script lang="ts" setup>
import { useResourcesStore } from '../store/resources-store';
import ResourceItem from '../components/ResourceItem.vue';


const resStore = useResourcesStore()

</script>


<template>
    <section class="resources panel">
        <header class="resources__header">
            <h1>Resources</h1>
        </header>

        <div class="resources__list">
            <ResourceItem v-for="resource in resStore.resources" 
                v-bind="resource"
            />
        </div>

    </section>

</template>


<style>
.resources {
    width: 15rem;
    min-height: 100vh;
}
.resources__header {
    text-align: center;
}

.resources__list {
    margin-top: 1rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}

</style>