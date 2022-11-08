import { useDemonsStore } from "../store/demons-store";
import { useResourcesStore } from "../store/resources-store";
import { eachSecond, startEventsModule } from "./events";
import { startGeneralEventsModule } from "./events-general";

let timerInterval: number;
let millisecondsAcc = 0;

export function start() {
    startEventsModule()
    startGeneralEventsModule()

    const resStore = useResourcesStore()
    let lastUpdate = Date.now()
    timerInterval = setInterval(()=>{
        const now = Date.now()
        const delta = Math.min(now - lastUpdate, 1000)

        lastUpdate = now;
        resStore.updateResources(delta)

        millisecondsAcc += delta
        if (millisecondsAcc >= 1000) {
            millisecondsAcc -= 1000
            eachSecond()
        }
    }, 100)
}