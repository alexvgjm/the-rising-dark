import * as fflate from "fflate";
import { DemonCreationPayload, DemonType } from "../store/demons-store";
import { Config } from "../store/stats-store";
import { events, stores } from "./events";
import { oneTimeEvents } from "./events-onetime";

export type SaveGame = {
    resources: {[k: string]: number},
    demons: DemonCreationPayload[],
    config: Config,
    demonsBaseCapacity: {[k in DemonType]: number},
    buildings: {[k: string]: number},
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
                            .map(([id, b]) => [id, b.level])
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

    const serializedData = fflate.strToU8(JSON.stringify(toSerialize))
    const compressed = fflate.compressSync(serializedData)
    const compressedString = fflate.strFromU8(compressed)
    localStorage.setItem('savegame', compressedString)
}

export function loadSaveObject() {
    const compressedString = localStorage.getItem('savegame')
    if (!compressedString) { return null }

    const compressed = fflate.strToU8(compressedString)
    const serializedData = fflate.decompressSync(compressed)
    return JSON.parse(fflate.strFromU8(serializedData)) as SaveGame
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

    Object.entries(sg.buildings).forEach(([id, level]) => {
        stores.buildStore.buildings[id].level = level
    })

    Object.entries(sg.resources).forEach(([name, quantity]) => {
        stores.resStore.resources[name].quantity = quantity
    })

    Object.entries(sg.demonsBaseCapacity).forEach(([dType, quantity]) => {
        stores.demonStore.baseCapacity[dType as DemonType] = quantity
    })

    return true
}