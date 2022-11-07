<script lang="ts" setup>
import { useMessagesStore } from '../store/messages-store';
import Message from '../components/Message.vue';


const msgStore = useMessagesStore()

</script>


<template>
    <section class="messages panel">
        <h1>Messages</h1>
        
        <Message v-for="msg in msgStore.messages" v-bind="msg"/>
    </section>
</template>


<style>
.messages {
    flex-grow: 0.5;
    max-width: 30rem;
    min-height: 100vh;
    margin-left: var(--space);

    max-height: 100vh;
    overflow: auto;
}

</style>