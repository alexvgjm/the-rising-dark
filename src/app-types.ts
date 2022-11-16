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
    inputs: Consumer[]
    outputs: Producer[]
}

export type Resource = {
    id: string,
    quantity: number,
    max: number
}











export type Building = {
    id: string,
    level: number,
    active?: number,
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