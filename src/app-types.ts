export type Point = {
    x: number, y: number
}

export interface Producer {
    level: number,
    name: string,
    production: {
        resource: string,
        base: number,
        factor: number
    }
}

export interface Consumer {
    level: number,
    name: string,
    consumption: {
        resource: string,
        base: number,
        factor: number
    }
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

export type Requirement = {
    type: 'building' | 'research' | 'achievement',
    name: string,
    level?: number
}

export type Building = {
    name: string,
    description: string,
    metadescription: string,
    level: number,
    requires?: Requirement[],

    buildCost: {
        resource: string,
        base: number,
        factor: number
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