import { useMessagesStore } from "../store/messages-store";
import { useResourcesStore } from "../store/resources-store";
import { each10Seconds, eachSecond, events, startEventsModule, stores } from "./events";
import { startGeneralEventsModule } from "./events-general";
import { startOneTimeEventsModule } from "./events-onetime";
import { setLoc, __t } from "./locale";
import { load, loadSaveObject, save, SaveGame } from "./save-load";


/**
 * First called before startGame. Set general config.
 */
export function preload() {
    return new Promise<SaveGame|null>((resolve, reject) => {
        const save = loadSaveObject()
        console.log(save);
        
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

let millisAccTo1s = 0;
let millisAccTo10s = 0;
export function startGame(savegame: SaveGame | null) {
    startEventsModule()
    startGeneralEventsModule()
    startOneTimeEventsModule()
    
    if(savegame) { load(savegame) }

    const resStore = useResourcesStore()
    const msgStore = useMessagesStore()

    let lastUpdate = Date.now()
    setInterval(()=>{
        const now = Date.now()
        const delta = Math.min(now - lastUpdate, 1000)

        lastUpdate = now;
        resStore.updateResources(delta)

        millisAccTo1s += delta
        millisAccTo10s += delta
        if (millisAccTo1s >= 1000) {
            millisAccTo1s -= 1000
            eachSecond()
        }

        if (millisAccTo10s >= 10000) {
            millisAccTo10s -= 10000
            each10Seconds()
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