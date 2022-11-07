export function calculateCost(level: number, base: number, factor: number) {
    return base + base * level * factor
}

export function calculateProduction(level: number, base: number, factor: number) {
    return base * level * factor
}

export function remToPx(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function toMaxFix(num: number, maxDigits: number) {
    const strnum = num.toString()
    const parts = strnum.split('.')
    const hasDecimalPartLongerThanMaxDigits = 
        parts.length == 2 && parts[1].length > maxDigits

    return hasDecimalPartLongerThanMaxDigits ? num.toFixed(maxDigits) : strnum
}