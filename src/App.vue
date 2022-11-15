<script setup lang="ts">
import ResourcesPanel from './panels/ResourcesPanel.vue';
import Main from './panels/Main.vue';
import MessagesPanel from './panels/MessagesPanel.vue';
import SimpleTooltip from './components/Tooltips/SimpleTooltip.vue';
import { inject, onMounted, ref } from 'vue';
import BuildingTooltip from './components/Tooltips/BuildingTooltip.vue';
import ResourceTooltip from './components/Tooltips/ResourceTooltip.vue';
import { preload, startGame } from "./controllers/general";
import { SaveGame } from "./controllers/save-load";
import LanguageSelection from './panels/LanguageSelection.vue';
import MainHeader from './panels/MainHeader.vue';
import { setLoc } from './controllers/locale';
import { useTooltipsStore } from './store/tooltip-store';

const loading = ref(true)
const langSelected = ref(false)

const tt = useTooltipsStore()

const error = ref()

let save: SaveGame | null = null
onMounted(() => {
  preload()
    .then((savegame) => {
      loading.value = false
      if(savegame) {
        langSelected.value = true
        startGame(savegame)
      }
    }).catch((({ reason, savegame }) => {
      save = savegame
      error.value = reason
      langSelected.value = true
    }))
})



function onLangSelected(lang: string) {
  loading.value = true
  setLoc(lang)
    .then(() => {
      setTimeout(
        () => loading.value = false,
        500
      )
      startGame(null);
    }).catch((({ reason, savegame }) => {
      save = savegame
      error.value = reason
    })).finally(() => {
      langSelected.value = true
    })
}

function start() {
  console.log("START");

  langSelected.value = true
  loading.value = false
  startGame(save)
}



</script>

<template>
  <MainHeader />

  <template v-if="loading">
    <div class="load-screen">
      <div class="load-screen__spinner" v-if="!error"></div>
      <h1 v-if="!error"><img class="emoji" src="./assets/icons/eknu.svg"> Loading...</h1>
      <div v-if="error" class="load-screen__error">
        <h2>Cannot change language</h2>
        <p><span class="load-screen__error-reason"></span>{{ error }}</p>
        <button @click="start">Continue</button>
      </div>
    </div>
  </template>

  <LanguageSelection @lang-selected="onLangSelected" v-if="!langSelected" />

  <template v-if="!loading && langSelected">
    <main>
      <ResourcesPanel />
      <Main />
      <MessagesPanel />
    </main>

    <SimpleTooltip   v-if="tt.visible && tt.tooltip.type == 'simple'"/>
    <BuildingTooltip v-if="tt.visible && tt.tooltip.type == 'building'"/>
    <ResourceTooltip v-if="tt.visible && tt.tooltip.type == 'resource'"/>
  </template>
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



.load-screen {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: var(--color-background-darkest);
  color: var(--color-third);
  z-index: 10;
}

.load-screen__spinner {
  width: 4rem;
  height: 4rem;
  border: 0.4rem dotted var(--color-third);
  border-radius: 50%;
  animation: spin 5s linear infinite;
}

.load-screen__error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--color-third-lighter);
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
