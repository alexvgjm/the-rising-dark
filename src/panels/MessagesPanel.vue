<script lang="ts" setup>
import { useMessagesStore } from '../store/messages-store';
import Message from '../components/Message.vue';
import { LOC } from '../controllers/locale';
import { ref } from 'vue';


const msgStore = useMessagesStore()

const open = ref(false)
function onOpenButtonClick() {
    open.value = !open.value
}
</script>


<template>
    <button class="messages__open-button"
            @click="onOpenButtonClick"
    >✉</button>

    <section class="messages panel" :class="{'messages--open': open}">
        <h1>{{LOC.general.ui.tabs.messages}}</h1>
        
        <Message v-for="msg in msgStore.messages"
                 :msg="msg"/>
    </section>
</template>


<style>
.messages {
    flex-grow: 0.5;
    max-width: 30rem;
    margin-left: var(--space);

    max-height: 100vh;
    overflow: auto;
}

.messages__open-button {
    display: none;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: var(--x2-space);
    left: var(--x1_5-space);
    font-size: var(--big-font-size);
    z-index: 13;
}

@media (max-width: 1024px) {
    .messages {
        top: -100vh;
        left: 0;
        margin: 0;
        position: fixed;
        max-width: 100%;
        min-width: 0;
        z-index: 12;
        height: 100vh;
        width: 100vw;
        transition: 0.25s top;
        opacity: 0.9;
        background: var(--color-background-darker);
        padding-bottom: 7.5rem;
    }

    .messages--open {
        top: 0;
    }

    .messages__open-button {
        display: flex;
    }
}
</style>