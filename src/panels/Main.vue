<script lang="ts" setup>
import { RouterLink, RouterView } from "vue-router";
import { LOC } from "../controllers/locale";
import { useStatsStore } from "../store/stats-store";

const statsStore = useStatsStore()
</script>


<template>
    <section class="panel main">
        <nav class="main-nav">
            <RouterLink to="/"
                        class="main-nav__link"
                        v-html="LOC.general.ui.tabs.buildings" />

            <RouterLink v-if="statsStore.achievements['First demon'].achieved" 
                        to="/demons"
                        class="main-nav__link"
                        v-html="LOC.general.ui.tabs.demons" />
        </nav>


        <RouterView></RouterView>
    </section>
</template>


<style>
.main {
    margin-left: var(--space);
    flex-grow: 2;
}

.main-nav {
    border-radius: var(--border-radius);
    display: flex;
    align-items: flex-end;
    border-bottom: var(--border-size) solid  var(--color-second);
}
.main-nav__link {
    display: block;
    padding: var(--h-space) var(--space);
    font-size: var(--font-size);
    font-weight: bold;
    color: var(--color-primary);
    border: var(--border-size) solid var(--color-primary);
    border-bottom-color: transparent;
    border-radius: 0.25rem 0.25rem 0 0;
}
.main-nav__link:hover {
    color: var(--color-second);
    border-color: var(--color-second);
    border-bottom-color: transparent;
}

.main-nav__link--active,
.main-nav__link--active:hover {
    background: var(--color-background-dark);
    color: var(--color-second);
    font-size: var(--1_25x-font-size);
    border-color: var(--color-second);
    transform: scale(1.02) translateY(0.1rem);
    border-bottom-color: transparent;
}

.main-nav + .panel {
    border-top: none;
}


@media (max-width: 1024px) {
    .main {
        margin-left: 0;
    }
}
</style>