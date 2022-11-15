<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import eknuImgUrl from "../assets/icons/eknu.svg";
import { Message } from "../store/messages-store";

const props = defineProps<{msg: Message}>()

const classes = computed(()=>{
    const cls = ['message--' + props.msg.type]
    if(props.msg.options?.extraClasses) {
        cls.push(
            ...props.msg.options.extraClasses.map(c=>'message--' + c)
        )
    }
    return cls
})
</script>


<template>
    <div class="message"
        :class="classes"
        :style='`--emoji-url: url("${eknuImgUrl}")`'>
        <span class="message__hour">[{{ msg.hour }}]</span>
        <span class="message__text" v-html="msg.text"></span>
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
    content: ' ';
    display: inline-block;
    width: 1.25em;
    height: 1.25em;
    background-image: var(--emoji-url);
    background-size: cover;
    margin-right: var(--q-space);
}
</style>