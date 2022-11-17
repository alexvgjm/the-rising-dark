<script lang="ts" setup>
import { langs, LOC } from '../controllers/locale';
import { save } from '../controllers/save-load';
import { useStatsStore } from '../store/stats-store';

const statStore = useStatsStore()

function changeLang(lang: string) {
    statStore.config.locale = lang
    save()
    window.location.reload()
}
</script>


<template>
    <section class="panel panel-settings ">
        <header class="panel__header">
            <h1 class="panel__title">{{LOC.general.ui.tabs.settings}}</h1>
        </header>

        <section class="panel">
            <header class="panel__header">
                <h1 class="panel__title">
                    {{LOC.general.ui.settings.language}}
                </h1>
            </header>

            <button v-for="(lang, langCode) in langs"
                @click="changeLang(langCode)"
                class="settings__lang-button">
                {{lang}}
            </button>
        </section>
    </section>
</template>


<style>
.settings__lang-button {
    margin-right: var(--h-space);
}
</style>