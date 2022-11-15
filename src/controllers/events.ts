import mitt from "mitt";
import { DemonsEvents, eachSecondDemonsEvents } from "./events-demons";
import { BuildingsEvents } from "./events-buildings";
import { getAllStores } from "./utils";

    
import './events-general'
import { eachSecondGeneralEventsCheckers, HumanDeathsPayload } from "./events-general";
import { MessageOptions } from "../store/messages-store";
const eachSecondOnetimeEvents = {
    'greetings': ()=>true,
    'firstImpHut': ()=>stores.buildStore.buildings['Imp hut'].level >= 1,
    'firstSoul': ()=>stores.resStore.resources['Souls'].quantity > 0,
    'twentySouls': ()=>stores.resStore.resources['Souls'].quantity >= 20
}

export type EventsDefinitions = 
    {[K in keyof typeof eachSecondOnetimeEvents]: boolean}
    & BuildingsEvents
    & DemonsEvents
    & {
        'starvation': number,
        'humanDeaths': HumanDeathsPayload
    }

export let stores: ReturnType<typeof getAllStores>
export function startEventsModule() {
    stores = getAllStores()
}

export const events = mitt<EventsDefinitions>()

export function eachSecond() {
    Object.values(eachSecondDemonsEvents).forEach(evt => evt())
    Object.values(eachSecondGeneralEventsCheckers).forEach(chk => chk())

    Object.entries(eachSecondOnetimeEvents).forEach((entry, i) => {
        const event = entry[0] as keyof typeof eachSecondOnetimeEvents
        const checker = entry[1]

        if (checker()) { 
            delete eachSecondOnetimeEvents[event]
            events.emit(event, true) 
        }
    })
}



