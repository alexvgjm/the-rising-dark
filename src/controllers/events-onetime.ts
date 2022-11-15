import { Building } from "../app-types"
import { events, stores } from "./events"
import { LOC, __t } from "./locale"

export function startOneTimeEventsModule() {
    console.log("One time events loaded");
    events.on('built', firstImpHut)
    events.on('firstSoul', firstSoul)
    events.on('twentySouls', twentySouls)
    events.on('greetings', greetings)
}

function greetings() {
    stores.msgStore.addMessage(__t(LOC.system.greetings1), 'system')
    setTimeout(()=>{
        stores.msgStore.addMessage(__t(LOC.system.greetings2), 'system')
    }, 7000)

    oneTimeEvents['greetings'] = true
    events.off('greetings', greetings)
}

function firstImpHut({building}: {building: Building}) {
    if (building.id !== 'Imp Hut') { return }

    stores.msgStore.addMessage(__t(LOC.system.firstImpHut), 'system')

    oneTimeEvents['firstImpHut'] = true
    events.off('built', firstImpHut)
}

function firstSoul () {
    stores.msgStore.addMessage(__t(LOC.system.firstSoul), 'system')

    oneTimeEvents['firstSoul'] = true
    events.off('firstSoul', firstSoul)
}

function twentySouls() {
    stores.msgStore.addMessage(__t(LOC.system.firstDemon1), 'system')
    stores.demonStore.baseCapacity['Imp'] += 1
    stores.statsStore.achievements['First demon'].achieved = true
    stores.demonStore.newRandomDemon('Imp')

    oneTimeEvents['twentySouls'] = true
    events.off('twentySouls', twentySouls)
}

export const oneTimeEvents = {
    'firstImpHut': false,
    'greetings': false,
    'firstSoul': false,
    'twentySouls': false
}