<script lang="ts" setup>
import { computed, Ref, ref } from 'vue';
import { LOC } from '../controllers/locale';
import { experienceToReachLevel, getTooltipPositionForElement, remToPx } from '../controllers/utils';
import { AVAILABLE_EMOJIS, parseEmojis } from '../controllers/emoji';
import { Demon, DemonType, useDemonsStore } from '../store/demons-store';
import { useTooltipsStore } from '../store/tooltip-store';
import ProgressBar from './ProgressBar.vue';

const props = defineProps<{demon: Demon}>()

const tt = useTooltipsStore()
const demStore = useDemonsStore()

const exiling = ref(false);

const demonEmojis: {[key in DemonType]: string} = {
    'Imp': '😈',
    'Grunt': '👺'
}

const profDiv = ref<HTMLElement>()
const exileBtn = ref<HTMLElement>()
const loyaltyBar = ref<{barRef: HTMLDivElement}>()

const minExp = computed(()=>Math.max(0, experienceToReachLevel(props.demon.level)))
const maxExp = computed(()=>experienceToReachLevel(props.demon.level+1))

function professionHover() {

    const profLocation =  // FIXME: using Rat hunter because typing...
        LOC.professions[props.demon.profession.id as 'Rat hunter']

    tt.showSimpleTooltip({
        title: profLocation.name,
        description: profLocation.description,
        metadescription: profLocation.metadescription,
    }, getTooltipPositionForElement(profDiv.value!))
}

function exileHover() {
    tt.showSimpleTooltip(
        LOC.general.ui.demon.exileTooltip, 
        getTooltipPositionForElement(exileBtn.value!)
    )
}

function loyaltyHover() {
    console.log(loyaltyBar.value!.barRef);
    
    tt.showUpkeepTooltip(props.demon, 
        getTooltipPositionForElement(loyaltyBar.value!.barRef)
    )
}

function exileDemon() { demStore.exileDemon(props.demon) }

</script>


<template>
    <article class="demon">
        <header class="demon__header">
            <h1 class="demon__name">
                <i v-html="parseEmojis(AVAILABLE_EMOJIS[demon.type])"></i> 
            {{demon.name}}</h1>
            <div class="demon__type">{{LOC.demons.types[demon.type]}} 
                <span class="demon__level">
                    {{LOC.general.ui.demon.level}} 
                    {{demon.level}}
                </span>
            </div>
        </header>

        <ProgressBar class="demon__experience-bar"
                     :min="minExp" :max="maxExp" 
                     :default-text="'percent'"
                     :hover-text="'valuesFromZero'"
                     :current="demon.experience">
                     {{LOC.general.ui.demon.nextLevel}}</ProgressBar>

        <ProgressBar class="demon__loyalty-bar"
                     ref="loyaltyBar"
                     @mouseenter="loyaltyHover" @focus="loyaltyHover"
                     @mouseleave="tt.hideTooltip" @blur="tt.hideTooltip"
                     :min="0" :max="100"
                     :default-text="'percent'"
                     :hover-text="'percent'"
                     :current="demon.loyalty">
                     {{LOC.general.ui.demon.loyalty}}</ProgressBar>
        
        <div class="demon__controls">
            <div class="demon__profession" ref="profDiv"
                @mouseenter="professionHover" @focus="professionHover"
                @mouseleave="tt.hideTooltip" @blur="tt.hideTooltip">
                {{ //@ts-ignore
                    LOC.professions[demon.profession.id].name
                }}
            </div>

            <button class="demon__exile-btn" ref="exileBtn"
                @click="exiling = true"
                @mouseenter="exileHover" @focus="exileHover"
                @mouseleave="tt.hideTooltip" @blur="tt.hideTooltip"
            >{{LOC.general.ui.demon.exile}}</button>
        </div>

        <div v-if="exiling" 
            @mouseleave="exiling=false"
            class="demon__exile-modal">
            <h2>Exile {{demon.name}}</h2>
            <div class="demon__exile-answers">
                <button @click="exileDemon"
                        class="demon__confirm-exile-btn">
                    {{LOC.general.ui.demon.confirmExile}}
                </button>
                <button @click="exiling = false"
                        class="demon__forgive-exile-btn">Forgive</button>
            </div>
        </div>
    </article>
</template>


<style>
.demon {
    display: inline-flex;
    flex-flow: column;
    width: fit-content;
    position: relative;
    padding: var(--space);
    box-shadow: var(--default-box-shadow);
    background: var(--color-background);
    border-radius: var(--border-radius);
    width: 100%;
    margin-right: var(--x2-space);
}
.demon__exile-modal {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    
    background: var(--color-background-darkest-a75);
    z-index: 1;
}

.demon__exile-answers {
    margin-top: var(--space);
}

.demon__profession {
    display: flex;
    justify-content: center;
    align-items: center;

    width: fit-content;
    margin-top: var(--h-space);
    padding: var(--q-space) var(--space);
    border-radius: var(--border-radius);
    
    background: var(--color-background-darker);
    user-select: none;
}

.demon__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--h-space);
    padding-bottom: var(--h-space);
    border-bottom: var(--border-size) solid var(--color-background-darkest);
}

.demon__experience-bar,
.demon__loyalty-bar {
    font-size: var(--lesser-font-size);
}

.demon__loyalty-bar {
    --color-progress-bar: var(--color-third-darkest);
    --color-progress-bar__filler: var(--color-third-dark);
    --color-progress-bar__text: var(--color-third-lightest);
}

.demon__exile-btn {
    margin-left: auto;
    padding: var(--q-space) var(--space);
}

.demon__exile-btn,
.demon__confirm-exile-btn {
    background: var(--color-danger-darkest);
    border-color: var(--color-second);
    color: var(--color-danger-light);
}

.demon__forgive-exile-btn {
    margin-left: var(--h-space);
}

.demon__exile-btn:hover {
    background: var(--color-danger-dark);
    color: var(--color-danger-light);
}
.demon__controls {
    display: flex;
    align-items: flex-end;
}

@media(max-width: 1024px) {
    .demon__controls {
        margin-top: var(--h-space);
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .demon__profession {
        width: 100%;
    }
    .demon__exile-btn {
        font-size: var(--lesser-font-size);
    }
}
</style>