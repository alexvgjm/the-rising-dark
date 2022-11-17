import { MessageOptions } from "../store/messages-store";
import { events, stores } from "./events";
import { LOC, __t } from "./locale";
import { randomInt } from "./utils";


export const eachSecondGeneralEventsCheckers = {
    checkStarvation
}

export function startGeneralEventsModule() {
    events.on('starvation', starvation)
    events.on('humanDeaths', humanDeaths)
}

let starvationThreshold = 0
function checkStarvation() {
    const noFood = stores.resStore.resources['Food'].quantity < 1
    const thereAreHumans = stores.resStore.resources['Humans'].quantity > 0
    
    if (noFood && thereAreHumans) {
        starvationThreshold = Math.min(1, starvationThreshold + 0.1)
        events.emit('starvation', starvationThreshold)
    } else if (thereAreHumans) {
        starvationThreshold = Math.max(0, starvationThreshold - 0.1)
    }
}


export type HumanDeathsPayload = {
    quantity: number, 
    reason: keyof typeof LOC.general.deathReasons,
    accumulative?: boolean,
    extraClasses?: string[]
}
function humanDeaths({ quantity, reason, extraClasses, accumulative}: 
                        HumanDeathsPayload) {
    stores.resStore.removeResource('Humans', quantity)
    stores.resStore.addResource('Souls', quantity)

    const lastMsg = accumulative
               && stores.msgStore.messages.length >= 1
               && stores.msgStore.messages[0].type == 'human-deaths'
               && stores.msgStore.messages[0].options!.replaceOnRepeat == reason
               && stores.msgStore.messages[0] 

    if (lastMsg) {
        quantity += lastMsg.options!.data
    }

    const diedMsg = quantity == 1 ? LOC.general.humanDeath.singular
    : __t(LOC.general.humanDeath.plural, {quantity})


    let msgClass = 'human-deaths'
    const options: MessageOptions = {extraClasses: extraClasses}
    
    if (accumulative) {
        options.replaceOnRepeat = reason,
        options.data = quantity
    }
    
    const reasonMsg = LOC.general.deathReasons[reason]
    stores.msgStore.addMessage(`${diedMsg} ${LOC.general.reason} ${reasonMsg}`, 
                                msgClass, options)
}

function starvation(threshold: number) {
    const r = Math.random()

    if (r < threshold && stores.resStore.resources['Humans'].quantity >= 1) {
        const deaths = Math.max(
            1, 
            randomInt(1,stores.resStore.resources['Humans'].quantity/2)
        )

        console.log("d: " + deaths);
        
        events.emit('humanDeaths', { 
            quantity: deaths, 
            reason: 'starvation',
            accumulative: true
        })
    }
}