<script lang="ts" setup>
import { computed } from 'vue';
import ActionButton from '../components/ActionButton.vue';
import BuildingButton from '../components/BuildingButton.vue';
import { LOC } from '../controllers/locale';
import { randomInt } from '../controllers/utils';
import { useBuildingsStore } from '../store/buildings-store';
import { useResourcesStore } from '../store/resources-store';


const buildingStore = useBuildingsStore()

const manualActions = computed(() => {
    return [{
        name: LOC.buildings.manualActions['Gather stones'].name,
        description: LOC.buildings.manualActions['Gather stones'].description,
        metadescription: LOC.buildings.manualActions['Gather stones'].metadescription,
        effect: () => {
            resStore.addResource('Stones', randomInt(5, 20)) 
        }
    },
    {
        name: LOC.buildings.manualActions['Gather bones'].name,
        description: LOC.buildings.manualActions['Gather bones'].description,
        metadescription: LOC.buildings.manualActions['Gather bones'].metadescription,
        effect: () => { resStore.addResource('Bones', randomInt(5, 20)) }
    },
    {
        name: LOC.buildings.manualActions['Gather rats'].name,
        description: LOC.buildings.manualActions['Gather rats'].description,
        metadescription: LOC.buildings.manualActions['Gather rats'].metadescription,
        effect: () => { resStore.addResource('Food', randomInt(1, 4)) }
    }]
})

const unlocked = computed(() =>
    Object.values(buildingStore.buildings)
          .filter(b => b.unlock))
const resStore = useResourcesStore()
</script>


<template>
    <section class="panel manual-actions">
        <header class="panel__header manual-actions__header">
            <h1 class="panel__title">
                {{ LOC.general.ui.sections.buildings.manualActions }}
            </h1>
        </header>

        
        <div class="buildings__buttons">
            <ActionButton v-for="mAction in manualActions" 
            @click="mAction.effect" 
            v-bind="mAction" :key="mAction.name"/>
        </div>
    </section>

    <section class="panel population">
        <header class="panel__header buildings__population">
            <h1 class="panel__title">
                {{ LOC.general.ui.sections.buildings.population }}
            </h1>
        </header>

        <div class="buildings__buttons">
            <BuildingButton 
                v-for="b in unlocked.filter(b => b.type == 'population')" 
                v-bind="b" />
        </div>
    </section>

    <section class="panel resources-section">
        <header class="panel__header buildings__resources">
            <h1 class="panel__title">
                {{ LOC.general.ui.sections.buildings.resources }}
            </h1>
        </header>

        <div class="buildings__buttons">
            <BuildingButton 
                v-for="b in unlocked.filter(b => b.type == 'resources')" 
                v-bind="b" />
        </div>
    </section>
</template>


<style>
.buildings__buttons {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: var(--h-space);
}
</style>