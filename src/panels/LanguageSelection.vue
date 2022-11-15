<script lang="ts" setup>
defineEmits<{
    (e: 'langSelected', lang: string): void
}>()

const langs = {
    'en': 'English',
    'es': 'Español'
}
</script>

<template>
    <section class="lang-selection">
        <h1>Language / Idioma</h1>
        <div class="lang-selection__lang-list">
            <button v-for="(lang, langCode) in langs"
                @click="$emit('langSelected', langCode)"
                class="lang-selection__button">
                {{lang}}
            </button>
        </div>
    </section>
</template>

<style>
.lang-selection,
.lang-selection__lang-list {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.lang-selection {
    width: 100%;
    height: 100%;
    align-items: center;
    flex-grow: 1;
    margin-bottom: 5rem;
}


.lang-selection__lang-list {
    margin-top: var(--space);
    width: fit-content;
}

.lang-selection__button {
    min-width: 15rem;
    padding: var(--h-space) var(--space);
}

</style>