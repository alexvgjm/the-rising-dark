<script setup lang="ts">
import ResourcesPanel from './panels/ResourcesPanel.vue';
import Main from './panels/Main.vue';
import MessagesPanel from './panels/MessagesPanel.vue';
import SimpleTooltip from './components/Tooltips/SimpleTooltip.vue';
import { inject, onMounted } from 'vue';
import { start } from './controllers/general';
import BuildingTooltip from './components/Tooltips/BuildingTooltip.vue';
import ResourceTooltip from './components/Tooltips/ResourceTooltip.vue';


onMounted(()=>{ start() })
const version = inject('version')

</script>

<template>
  <header class="game__header panel">
    <h1 class="game__title">The Rising Dark</h1>
    <p class="game__subtitle">An unlucky dark elf simulator</p>
    <div class="game__version">Version {{version}}</div>
    <div class="game__copyright">2022 © Alexander Vega</div>
  </header>
  <main>
    <ResourcesPanel />
    <Main />
    <MessagesPanel />
  </main>
  
  <SimpleTooltip />
  <BuildingTooltip />
  <ResourceTooltip />
</template>

<style>
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    width: 100%;
    padding: var(--space);
}
.game__title {
  font-size: var(--font-size);
}
.game__header,
.game__footer {
  display: flex;
  align-items: center;
  padding: var(--h-space) var(--x2-space);
}
.game__subtitle {
  margin: 0;
  margin-left: var(--space);
}
.game__version {
  font-size: 0.9rem;
  color: var(--color-primary-light);
  margin: 0 var(--h-space) 0 auto;
}

.game__copyright {
  font-size: 0.9rem;
  color: var(--color-primary-light);
}
</style>
