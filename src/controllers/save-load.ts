import { DemonCreationPayload, DemonType } from "../store/demons-store";
import { Config } from "../store/stats-store";
import { events, stores } from "./events";
import { oneTimeEvents } from "./events-onetime";
import { compressToBase64, decompressFromBase64 } from "lz-string";

export type SaveGame = {
    resources: {[k: string]: number},
    demons: DemonCreationPayload[],
    config: Config,
    demonsBaseCapacity: {[k in DemonType]: number},
    buildings: {[k: string]: {
        level: number,
        active?: number
    }},
    achievements: string[],
    completedOneTimeEvents: (keyof typeof oneTimeEvents)[]
}

export function save() {
    const resources = Object.fromEntries(
                        Object.entries(stores.resStore.resources)
                              .map(([id, r]) => [id, r.quantity])
                      )
    
    const demons: DemonCreationPayload[] = stores.demonStore.demons
                    .map(d => {return {
                            type: d.type,
                            name: d.name,
                            experience: d.experience,
                            loyalty: d.loyalty, 
                            professionId: d.profession.id
                        }})
    const demonsBaseCapacity: {[key in DemonType]: number} = 
        Object.fromEntries(
            Object.entries(stores.demonStore.baseCapacity)
                   .map(([id, cap]) => [id, cap])
        ) as {[key in DemonType]: number}

    const buildings = Object.fromEntries(
                        Object.entries(stores.buildStore.buildings)
                            .map(([id, b]) => [id, {
                                level: b.level,
                                active: b.active
                            }])
                      )

    // Only names of achieved achievements.
    const achievements = Object.entries(stores.statsStore.achievements)
                               .filter(([name, ach]) => ach.achieved)
                               .map(([name, ach]) => name)

    
    // Only names of completed events.
    const completedOneTimeEvents = 
        Object.entries(oneTimeEvents)
            .filter(([evt, done]) => done)
            .map(([evt,done]) => evt) as unknown as (keyof typeof oneTimeEvents)[]

    const toSerialize: SaveGame = {
        resources, demons, demonsBaseCapacity, buildings,
        achievements, completedOneTimeEvents, config: stores.statsStore.config
    }

    const jsonString = JSON.stringify(toSerialize)
    const compressed = compressToBase64(jsonString)
    localStorage.setItem('savegame', compressed)
}

export function loadSaveObject() {
    const compressed = localStorage.getItem('savegame')
    if (!compressed) { return null }
    const jsonString = decompressFromBase64(compressed)!
    return JSON.parse(jsonString) as SaveGame
}

/**
 * @returns true if savegame loaded
 */
export function load(sg: SaveGame) {

    Object.entries(sg.config).forEach(([key, value]) => {
        //@ts-ignore
        stores.statsStore.config[key] = value
    })

    sg.completedOneTimeEvents.forEach(completedEvent => {
        oneTimeEvents[completedEvent] = true
        events.off(completedEvent)
    })

    sg.achievements.forEach(
        a => stores.statsStore.achievements[a].achieved = true
    )

    sg.demons.forEach(d => stores.demonStore.newCustomDemon(d))

    Object.entries(sg.buildings).forEach(([id, payload]) => {
        if(typeof(payload) == 'number') {
            stores.buildStore.buildings[id].level = payload
        } else {
            stores.buildStore.buildings[id].level = payload.level
            stores.buildStore.buildings[id].active = payload.active
        }
    })

    Object.entries(sg.resources).forEach(([name, quantity]) => {
        stores.resStore.resources[name].quantity = quantity
    })

    Object.entries(sg.demonsBaseCapacity).forEach(([dType, quantity]) => {
        stores.demonStore.baseCapacity[dType as DemonType] = quantity
    })

    return true
}