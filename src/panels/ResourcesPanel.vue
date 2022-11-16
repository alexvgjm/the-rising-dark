<script lang="ts" setup>
import { useResourcesStore } from '../store/resources-store';
import ResourceItem from '../components/ResourceItem.vue';
import { LOC } from '../controllers/locale';


const resStore = useResourcesStore()

</script>


<template>
    <section class="resources panel">
        <header class="resources__header">
            <h1>{{ LOC.general.ui.tabs.resources }}</h1>
        </header>

        <div class="resources__list">
            <ResourceItem v-for="resource in resStore.resources" v-bind="resource" />
        </div>

    </section>

</template>


<style>
.resources {
    width: 25rem;
    min-width: 25rem;
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

@media (max-width: 1280px) {
    .resources {
        width: 15rem;
        min-width: 15rem;
    }
}


@media (max-width: 1024px) {
    .resources {
        max-width: none;
        width: 100%;
        margin-bottom: var(--h-space);
    }

    .resources__header {
        display: none;
    }
    .resources__list {
        margin-top: 0;
        flex-direction: row;
        width: 100%;
    }
}
</style>