export const PER_LEVEL_PRODUCTIONS = {
    buildings: {
        humanPitHumans: 0.1,
        get humanPit10sHumans(){ return this.humanPitHumans * 10 }
    },
    professions: {
        ratHuntingFood: 0.05,
    }
}

export const PER_LEVEL_CONSUMPTIONS = {
    buildings: {
        humanPitFood: 0.25,
        sacrificialPit10sHumans: 1
    },
}

/** 
 * upkeep formula:  
 *     (base * demonLevel / 3)
 *  
 * Here the base:
 */
export const UPKEEPS = {
    impSoulsUpkeep: 0.02
}




export const CONSTANTS = {
    ...PER_LEVEL_PRODUCTIONS.buildings,
    ...PER_LEVEL_PRODUCTIONS.professions,
    ...PER_LEVEL_CONSUMPTIONS.buildings,
    ...UPKEEPS
}