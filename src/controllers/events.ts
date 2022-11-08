import { useResourcesStore } from "../store/resources-store";
import mitt from "mitt";
import { DemonsEvents } from "./events-demons";

const oneTimeEmitters = {
    'firstSoul': ()=>resStore.resources['Souls'].quantity > 0,
    'fiveSouls': ()=>resStore.resources['Souls'].quantity >= 5
}

export type EventsDefinitions = 
    {[K in keyof typeof oneTimeEmitters]: boolean}
    & DemonsEvents
    & {
        'starvation': number,
        'humanDeaths': {quantity: number, reason: string}
    }

let resStore: ReturnType<typeof useResourcesStore>
export function startEventsModule() {
    resStore = useResourcesStore()
}

export const events = mitt<EventsDefinitions>()

export function eachSecond() {
    checkStarvation()

    Object.entries(oneTimeEmitters).forEach((entry) => {
        const event = entry[0] as keyof EventsDefinitions
        const checker = entry[1]

        if (checker()) { events.emit(event, true) }
    })
}

let starvationThreshold = 0
function checkStarvation() {
    const noFood = resStore.resources['Food'].quantity == 0
    const thereAreHumans = resStore.resources['Humans'].quantity > 0

    if (noFood && thereAreHumans) {
        starvationThreshold = Math.min(1, starvationThreshold + 0.1)
        events.emit('starvation', starvationThreshold)
    } else if (thereAreHumans) {
        starvationThreshold = Math.max(0, starvationThreshold - 0.1)
    }
}

