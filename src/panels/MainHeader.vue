<script lang="ts" setup>
import { inject } from 'vue';

const version = inject('version')
</script>

<template>
    <header class="game__header panel">
        <h1 class="game__title">The Rising Dark</h1>
        <p class="game__subtitle">An unlucky dark elf simulator</p>
        <div class="game__version">Version {{ version }}</div>
        <div class="game__copyright">2022 © Alexander Vega</div>
    </header>
</template>

<style>
.game__title {
    font-size: var(--font-size);
}

.game__header,
.game__footer {
    position: relative;
    z-index: 11;
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
