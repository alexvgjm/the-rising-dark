<script lang="ts" setup>
import { useMessagesStore } from '../store/messages-store';
import Message from '../components/Message.vue';
import { LOC } from '../controllers/locale';


const msgStore = useMessagesStore()

</script>


<template>
    <section class="messages panel">
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

</style>