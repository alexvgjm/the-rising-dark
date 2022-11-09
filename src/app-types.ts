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









export type Building = {
    name: string,
    description: string,
    metadescription: string,
    level: number,
    unlock: boolean,

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