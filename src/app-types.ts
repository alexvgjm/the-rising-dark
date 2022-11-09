export type Point = {
    x: number, y: number
}


export interface ResourceStorage {
    resource: string,
    storage: ()=>number
}
export interface Consumer {
    description: string,
    resource: string
    quantity: ()=>number
}
export interface Producer {
    description: string,
    resource: string
    quantity: ()=>number
}
export interface Converter {
    multiplier: ()=>number
    description: string
    inputs: {[key: string]: number}
    outputs: {[key: string]: number}
}

export type Resource = {
    name: string,
    description: string,
    quantity: number,
    max: number,
    emoji?: string
}

export type Message = {
    text: string,
    type: string,
    hour: string
}

interface BaseUnlockRequirement {
    type: 'building' | 'research' | 'achievement',
    name: string
}

interface UnlockBuildingReq extends BaseUnlockRequirement {
    type: 'building',
    level: number
}

interface UnlockResearchReq extends BaseUnlockRequirement {
    type: 'research'
}

interface UnlockAchievementReq extends BaseUnlockRequirement {
    type: 'achievement'
}

export type UnlockRequirement = UnlockBuildingReq 
                                | UnlockResearchReq 
                                | UnlockAchievementReq














export type Building = {
    name: string,
    description: string,
    metadescription: string,
    level: number,
    requires?: BaseUnlockRequirement[],

    buildCost: {
        resource: string,
        quantity: ()=>number
    }[]

    consumption?: {
        resource: string,
        base: number,
        factor: number
    }[]

    production?: {
        resource: string,
        base: number,
        factor: number
    }[]
}

export type ManualAction = {
    name: string,
    description: string,
    metadescription: string
}