import { useMessagesStore } from "../store/messages-store";
import { useResourcesStore } from "../store/resources-store";
import { eachSecond, events, startEventsModule, stores } from "./events";
import { startGeneralEventsModule } from "./events-general";
import { setLoc, __t } from "./locale";
import { loadSaveObject, SaveGame } from "./save-load";

let millisecondsAcc = 0;

/**
 * First called before startGame. Set general config.
 */
export function preload() {
    return new Promise<SaveGame|null>((resolve, reject) => {
        const save = loadSaveObject()
        if (save) {
            setLoc(save.config.locale).then(()=>{
                resolve(save)
            }).catch(e => {
                reject({reason: e, save: save})
            })
        } else {
            resolve(null)
        }
    })

}

export function startGame(savegame: SaveGame | null) {
    startEventsModule()
    startGeneralEventsModule()

    const resStore = useResourcesStore()
    const msgStore = useMessagesStore()

    let lastUpdate = Date.now()
    setInterval(()=>{
        const now = Date.now()
        const delta = Math.min(now - lastUpdate, 1000)

        lastUpdate = now;
        resStore.updateResources(delta)

        millisecondsAcc += delta
        if (millisecondsAcc >= 1000) {
            millisecondsAcc -= 1000
            eachSecond()
        }
    }, 250)


    if (!savegame) {
       /* resStore.addResource('Souls', 20)
        resStore.addResource('Stones', 1000)
        resStore.addResource('Food', 1)
        resStore.addResource('Humans', 0)*/
        events.emit('greetings', true)
    }
}