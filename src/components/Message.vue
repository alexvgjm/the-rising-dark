<script lang="ts" setup>
import { Message } from '../app-types';

defineProps<Message>()
</script>


<template>
    <div class="message" :class="'message--' + type">
        <span class="message__hour">[{{ hour }}]</span>
        <span class="message__text">{{ text }}</span>
    </div>
</template>


<style>
.message {
    margin-top: var(--h-space);
}
.message__hour {
    margin-right: var(--q-space);
    font-weight: bold;
}

.message--system {
    color: var(--color-msg-system);
}

.message--system .message__text::before {
    content: '👾 ';
}
</style>