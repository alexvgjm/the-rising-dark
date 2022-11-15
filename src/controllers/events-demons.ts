import { events, stores } from "./events"
import { LOC } from "./locale"
import { randomInt } from "./utils"

export type DemonsEvents = {
    'ratHunting': number
}


export const eachSecondDemonsEvents = {
    'ratHunting': ()=>{
        const ratHunters = 
            stores.demonStore.demons
                   .filter(d => d.profession.id == 'Rat hunter')
        
        let humansToKill = 0
        ratHunters.forEach(rh => {
            if (randomInt(1, 300) < Math.min(rh.level, 10)) {
                humansToKill++
            }
            if (rh.level < 5) {
                rh.experience += 0.05
            }
        })

        humansToKill = 
            Math.floor(Math.min(stores.resStore.resources['Humans'].quantity, humansToKill))

        if (humansToKill > 0) {
            events.emit('ratHunting', humansToKill)
            events.emit('humanDeaths', 
                {quantity: humansToKill, 
                 reason: 'ratHunting',
                 extraClasses: ['rat-hunting'],
                 accumulative: true
                })
        }
    }
}