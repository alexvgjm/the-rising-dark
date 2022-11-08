import { useDemonsStore } from "../store/demons-store"
import { useResourcesStore } from "../store/resources-store"
import { events } from "./events"
import { randomInt } from "./utils"

export type DemonsEvents = {
    'ratHunterKillHumans': number
}

let resStore: ReturnType<typeof useResourcesStore>
let demonsStore : ReturnType<typeof useDemonsStore>
export function startDemonsEventsEmitterModule() {
    resStore = useResourcesStore()
    demonsStore = useDemonsStore()
}

export const eachSecondDemonsEvents = {
    'ratHunterKillHumans': ()=>{
        const ratHunters = 
            demonsStore.demons
                   .filter(d => d.profession.name == 'Rat hunter')
        
        let humansToKill = 0
        ratHunters.forEach(rh => {
            if (randomInt(1, 200) < rh.level) {
                humansToKill++
            }
        })

        humansToKill = 
            Math.min(resStore.resources['humans'].quantity, humansToKill)

        events.emit('ratHunterKillHumans', humansToKill)
        events.emit('humanDeaths', {quantity: humansToKill, reason: 'Rat hunter'})
    }
}