
export type ObjectGeneric = { [k: string]: any }

export type Color = [number, number, number]

export type Override<T1, T2> = Omit<T1, keyof T2> & T2