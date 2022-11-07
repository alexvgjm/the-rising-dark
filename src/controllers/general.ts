import { useResourcesStore } from "../store/resources-store";

let timerInterval: number;

export function start() {
    const resStore = useResourcesStore()
    let lastUpdate = Date.now()
    timerInterval = setInterval(()=>{
        const now = Date.now()
        const delta = now - lastUpdate
        lastUpdate = now;
        resStore.updateResources(delta)
    }, 100)
}