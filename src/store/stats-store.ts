import { defineStore } from "pinia";
import { reactive } from "vue";


export interface Achievement {
    type: 'progress' | 'building' | 'resource' | 'demons'
    name: string,
    description: string,
    metadescription: string,
    achieved: boolean
}

export type Config = {
    locale: string
}

export const useStatsStore = defineStore(
    'stats',
    () => {
        const config: Config = reactive({
            locale: 'en'
        })

        const achievements = reactive<{[key: string]: Achievement}>({
            'First demon': {
                type: 'demons',
                name: 'First demon',
                description: 'Get your first demon servant.',
                metadescription: "Don't get overexcited, he just wants your souls.",
                achieved: false
            }
        })

        function completeAchievement(name: string) {
            achievements[name].achieved = true
        }
        
        return {achievements, config, completeAchievement}
    }
)