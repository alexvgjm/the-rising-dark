import { defineStore } from "pinia";
import { reactive } from "vue";
import { Message } from "../app-types";


export const useMessagesStore = defineStore(
    'messages',
    () => {
        const messages = reactive<Message[]>([])

        function addMessage(text: string, type = '') {
            const date = new Date()
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            messages.unshift({text, type, hour: hours + ':' + minutes})

            if(messages.length > 50) {
                messages.length = 50
            }
        }
        
        addMessage(
            '👾 Welcome overseer. The Witch King has given you the task of turning the devastated lands into an efficient human farm. If you fail... to be honest I don\'t think there\'s anything worse than being in this boring place.',
            'system'
        )


        return { messages }
    }
)