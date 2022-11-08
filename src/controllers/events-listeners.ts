import { useResourcesStore } from "../store/resources-store";
import { events } from "./events-emission";
import { useMessagesStore } from "../store/messages-store";

let resStore: ReturnType<typeof useResourcesStore>
let msgStore: ReturnType<typeof useMessagesStore>

export function startEventsListenerModule() {
    resStore = useResourcesStore()
    msgStore = useMessagesStore()
}

events.on('starvation', (threshold)=> {
    const r = Math.random()
    if (r < threshold && resStore.resources['Humans'].quantity >= 1) {
        events.emit('humanDeaths', 1)
    }
})

events.on('humanDeaths', (quantity) => {
    const diedMsg = quantity == 1 ? 'A human has' : `${quantity} humans have`
    msgStore.addMessage(`Your humans are starving! 🤣 ${diedMsg} died 🎉`)
    resStore.removeResource('Humans', quantity)
    resStore.addResource('Souls', quantity)
})



events.on('firstSoul', ()=> {
    msgStore.addMessage("My Dark Lord, you just reaped your first soul. "
                     +  "I recommend you to keep breeding and starving your "
                     +  "humans. At least you don't get dirty blood on yourself.", 
                     'system')
    events.off('firstSoul')
    oneTimeEvents['firstSoul'] = true
})

events.on('fiveSouls', ()=> {
    msgStore.addMessage("Your souls atracts some 👹 imps. They consume "
                      + "souls but can help you with some tasks. They will "
                      + "serve you or die trying.", 'system')
    events.off('fiveSouls')
    oneTimeEvents['fiveSouls'] = true
})


const oneTimeEvents = {
    'firstSoul': false,
    'fiveSouls': false
}