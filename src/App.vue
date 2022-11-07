<script setup lang="ts">
import ResourcesPanel from './panels/ResourcesPanel.vue';
import World from './panels/World.vue';
import MessagesPanel from './panels/MessagesPanel.vue';
import Tooltip from './components/Tooltip.vue';
import { onMounted } from 'vue';
import { start } from './controllers/general';


onMounted(()=>{
  start()
})

</script>

<template>

  <main>
    <Tooltip />
    <ResourcesPanel />
    <World />
    <MessagesPanel />
  </main>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
