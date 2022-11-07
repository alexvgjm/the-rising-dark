<script lang="ts" setup>
import BuildingPanel from './BuildingPanel.vue';
import ManualActionsPanel from './ManualActionsPanel.vue';


</script>


<template>
    <section class="panel world">
        <ManualActionsPanel />
        <BuildingPanel />
    </section>
</template>


<style>
.world {
    margin-left: var(--space);
    flex-grow: 2;
}
</style>