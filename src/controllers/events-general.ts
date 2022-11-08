import { useResourcesStore } from "../store/resources-store";
import { events } from "./events";
import { useMessagesStore } from "../store/messages-store";
import { useDemonsStore } from "../store/demons-store";

let resStore: ReturnType<typeof useResourcesStore>
let msgStore: ReturnType<typeof useMessagesStore>
let demonStore: ReturnType<typeof useDemonsStore>

export function startGeneralEventsModule() {
    resStore = useResourcesStore()
    msgStore = useMessagesStore()
    demonStore = useDemonsStore()
}

events.on('starvation', (threshold)=> {
    const r = Math.random()
    if (r < threshold && resStore.resources['Humans'].quantity >= 1) {
        events.emit('humanDeaths', {quantity: 1, reason: 'starvation 🤣'})
    }
})

events.on('humanDeaths', ({quantity, reason}) => {
    const diedMsg = quantity == 1 ? 'A human has died' 
                                  : `${quantity} humans have died`
    
    msgStore.addMessage(`🎉 ${diedMsg}. Reason: ${reason}`)
    resStore.removeResource('Humans', quantity)
    resStore.addResource('Souls', quantity)
})

events.on('firstSoul', ()=> {
    msgStore.addMessage("My Dark Lord, you just reaped your first soul. "
                      + "I recommend you to keep breeding and starving your "
                      + "humans. At least you don't get dirty blood on yourself.", 
                     'system')
    events.off('firstSoul')
    oneTimeEvents['firstSoul'] = true
})

events.on('fiveSouls', ()=> {
    demonStore.newDemon('Imp')
    msgStore.addMessage("Your souls attract some lesser demons. An 😈 " 
                      + "Imp join us. They consume souls but can help you with "
                      + "some tasks. They will stay loyal as long as they have "
                      + "what they want.", 
                      'system')
    msgStore.addMessage(
        'Oh, the Imp is a rat hunter, a food source and a way to '
      + 'ocassionally kill humans by "accident". Now we need a more effective '
      + 'way to kill humans. A sacrificial pit would be nice.', 
        'system')
    events.off('fiveSouls')
    oneTimeEvents['fiveSouls'] = true
})


const oneTimeEvents = {
    'firstSoul': false,
    'fiveSouls': false
}