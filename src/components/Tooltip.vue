<script lang="ts" setup>
import { useTooltipsStore } from '../store/tooltip-store';

const tt = useTooltipsStore()
</script>


<template>
    <section class="tooltip" 
            :class="{'tooltip--visible': tt.visible}"
            :style="{left: tt.position.x + 'px', top: tt.position.y + 'px'}">
        <h1 class="tooltip__title">{{tt.title}}</h1>

        <div class="tooltip__sections">
            <div v-for="section in tt.sections"
                 :class="'tooltip__section tooltip__section--' + section.type"
            >
                <div v-for="content in section.content"
                    :class="'tooltip__content ' + 'tooltip__content--' + content.classes?.join(' ')">
                    {{content.text}}
                </div>
            </div>
        </div>
    </section>
</template>


<style>
.tooltip {
    position: fixed;
    top: 0;
    left: 0;
    background: var(--color-background-darkest-a90);
    flex-flow: column;
    width: 20rem;
    justify-content: center;
    text-align: center;
    padding: var(--space);
    z-index: 1;
    display: none;
}

.tooltip--visible {
    display: flex;
}

.tooltip__section {
    margin-top: var(--h-space);
    padding: var(--h-space) 0;
    border-top: var(--border-size) solid var(--color-background);
}

.tooltip__section--costs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: var(--space);
}


.tooltip__section--metadescription {
    font-style: italic;
    opacity: 0.6;
}

.tooltip__content--unaffordable,
.tooltip__content--negative {
    color: var(--color-unaffordable);
    font-weight: bold;
}

.tooltip__content--positive {
    color: var(--color-success);
}

</style>