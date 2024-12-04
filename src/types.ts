
export type ObjectGeneric = { [k: string]: any }

export type Color = [number, number, number]

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ErrorOptions = {
    /** Original error passed as is */
    err?: any
    /** You may benefit not to throw the error, but just log, maybe notifying admins if you configured it so, but let your script continue */
    doNotThrow?: boolean
    /** http error code (404, 403...etc) */
    code?: number
    doNotDisplayCode?: boolean
    notifyAdmins?: boolean
    extraInfosRenderer?: (extraInfosObj: ObjectGeneric) => string[]
    /** Usually the Error will wait to see if error is catched within 1 JS loop frame */
    doNotWaitOneFrameForLog?: boolean
    noStackTrace?: boolean
    /** Extra infos to be masked in front end logs (should be handled by your application) */
    maskForFront?: Record<string, any>
    [k: string]: any
}