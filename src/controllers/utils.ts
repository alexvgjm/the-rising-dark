import { useBuildingsStore } from "../store/buildings-store"
import { useDemonsStore } from "../store/demons-store"
import { useMessagesStore } from "../store/messages-store"
import { useResourcesStore } from "../store/resources-store"
import { useStatsStore } from "../store/stats-store"
import { useTooltipsStore } from "../store/tooltip-store"

export function calculateCostByLevel(level: number, base: number, factor: number) {
    return base + base * level * factor
}

export function calculateProduction(level: number, base: number, factor: number) {
    return base * level * factor
}

export function getAllStores() {
    return {
        resStore: useResourcesStore(),
        buildStore: useBuildingsStore(),
        ttStore: useTooltipsStore(),
        demonStore: useDemonsStore(),
        msgStore: useMessagesStore(),
        statsStore: useStatsStore()
    }
}

export function experienceToReachLevel(level: number) {
    return Math.ceil( Math.pow((level-1), 1.5) * 50)
}

export function levelFromExp(xp: number) {
    xp = Math.floor(xp)
    return Math.floor( Math.pow(xp / 50, 1/1.5) + 1)
}

export function remToPx(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max-min+1)) + min
}

export function shuffle(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function randomPick<T>(array: T[]): T {
    return array[randomInt(0, array.length-1)]
}

export function toMaxFix(num: number, maxDigits: number) {
    const strnum = num.toString()
    const parts = strnum.split('.')
    const hasDecimalPartLongerThanMaxDigits = 
        parts.length == 2 && parts[1].length > maxDigits

    return hasDecimalPartLongerThanMaxDigits ? num.toFixed(maxDigits) : strnum
}

export function getTooltipPositionForElement(
    elm: HTMLElement, 
    side: 'right' | 'bottom' = 'bottom') {

    const bRect = elm.getBoundingClientRect()

    if (side == 'bottom') {
        return {
            x: bRect.left - (remToPx(20) - bRect.width) / 2,
            y: bRect.bottom + 10 - elm.scrollTop
        }
    }

    return {
        x: bRect.left + bRect.width + 10,
        y: bRect.top - 25
    }

}