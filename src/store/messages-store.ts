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

        for(let i = 0; i < 200; i++) {
            addMessage(
                'Neural network operative. Welcome, overseer.',
                'system'
            )
        }


        return { messages }
    }
)