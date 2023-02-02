
export type ObjectGeneric = { [k: string]: any }

export type Color = [number, number, number]

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ErrorOptions = {
    err?: any
    doNotThrow?: boolean
    code?: number
    doNotDisplayCode?: boolean
    notifyOnSlackChannel?: boolean
    extraInfosRenderer?: (extraInfosObj: ObjectGeneric) => string[]
    doNotWaitOneFrameForLog?: boolean
    noStackTrace?: boolean
    [k: string]: any
}