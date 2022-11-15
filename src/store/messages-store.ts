import { defineStore } from "pinia";
import { reactive } from "vue";


export type MessageOptions = {
    /** 
     * If consecutive msgs of defined type in this property, replace the
     * previous one by this.
     */
    replaceOnRepeat ?: string,

    /**
     * Messages can contain data for any purpose. It will not be displayed.
     */
    data ?: any,

    /** Will be converted to message--extra-class*/
    extraClasses?: string[]
}
export type Message = {
    text: string,
    type: string,
    hour: string,
    options?: MessageOptions
}
export const useMessagesStore = defineStore(
    'messages',
    () => {
        const messages = reactive<Message[]>([])

        function addMessage(text: string, type = '', options?: MessageOptions) {
            const date = new Date()
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')

            const newMsg = {text, type, hour: hours + ':' + minutes, options}
            if(messages.length > 0 && options?.replaceOnRepeat
            && messages[0].options?.replaceOnRepeat == options.replaceOnRepeat) {
                messages.splice(0, 1, newMsg)
            } else {
                messages.unshift(newMsg)
            }

            if(messages.length > 50) {
                messages.length = 50
            }
        }

        return { messages, addMessage }
    }
)