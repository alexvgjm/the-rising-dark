import { Demon, DemonType } from "../store/demons-store"
import { AVAILABLE_EMOJIS } from "./emoji"
import { events, stores } from "./events"
import { LOC, __t } from "./locale"
import { randomInt } from "./utils"

export type DemonsEvents = {
    'ratHunting': number,
    'demonBetrayal': Demon,
    'demonSpawn': Demon,
}


export const each10SecondsDemonsEvents = {
    'demonSpawn': () => {
        Object.entries(stores.demonStore.capacities)
            .forEach(([dType, cap]) => {
                if (stores.demonStore.demons
                    .filter(d => d.type == dType)
                    .length >= (cap as unknown as number)) {
                    return
                }

                if (randomInt(1, 100) < 101) {
                    const demon = 
                        stores.demonStore.newRandomDemon(dType as DemonType)

                    events.emit('demonSpawn', demon)
                    
                    stores.msgStore.addMessage(
                        __t(LOC.demons.messages.demonSpawn, {
                            demonName: demon.name,
                            demonEmoji: AVAILABLE_EMOJIS[demon.type],
                            demonLevel: demon.level,
                            demonType: demon.type
                        }),
                        'demon-spawn',
                    )
                }

            })
    },
}

export const eachSecondDemonsEvents = {
    'loyalty': () => {
        stores.demonStore.demons.forEach(d => {
            if (d.upkeep.some(c =>
                c.quantity() > stores.resStore.resources[c.resource].quantity
            )) {
                d.loyalty = Math.max(d.loyalty - 0.25, 0)
                if (d.loyalty == 0) { events.emit('demonBetrayal', d) }
            } else {
                d.loyalty = Math.min(d.loyalty + 0.05, 100)
            }
        })
    },

    'ratHunting': () => {
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
                {
                    quantity: humansToKill,
                    reason: 'ratHunting',
                    extraClasses: ['rat-hunting'],
                    accumulative: true
                })
        }
    }
}


// Listeners
