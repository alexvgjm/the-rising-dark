export function calculateCostByLevel(level: number, base: number, factor: number) {
    return base + base * level * factor
}

export function calculateProduction(level: number, base: number, factor: number) {
    return base * level * factor
}

function test() {
    for(let i = 0; i < 10; i++) {
        const xp = experienceToReachLevel(i)
        const lvl = levelFromExp(xp)
        console.log(i + "\t" + xp + "\t" + lvl);
    }
}

export function experienceToReachLevel(level: number) {
    return Math.floor( Math.pow((level-1), 1.5) * 50)
}

export function levelFromExp(xp: number) {
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