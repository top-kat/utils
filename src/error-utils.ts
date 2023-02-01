//----------------------------------------
// ERROR UTILS
//----------------------------------------
import { configFn } from "./config"
import { isset } from "./isset"
import { isEmpty } from "./is-empty"
import { ErrorOptions } from "./types"
import { cleanStackTrace } from "./clean-stack-trace"
import { C } from "./logger-utils"
export { ErrorOptions } from './types'

export function errIfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, false, objOfVarNamesWithValues) }

export function err500IfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, false, objOfVarNamesWithValues) }

export function errIfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, true, objOfVarNamesWithValues) }

export function err500IfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, true, objOfVarNamesWithValues) }

export function errXXXIfNotSet(errCode, checkEmpty, objOfVarNamesWithValues) {
    let missingVars = []
    for (let prop in objOfVarNamesWithValues) {
        if (!isset(objOfVarNamesWithValues[prop]) || (checkEmpty && isEmpty(objOfVarNamesWithValues[prop]))) missingVars.push(prop)
    }
    if (missingVars.length) throw new DescriptiveError(`requiredVariableEmptyOrNotSet`, { code: errCode, origin: 'Validator', varNames: missingVars.join(', ') })
}


export function err422IfNotSet(o) {
    let m = []
    for (let p in o) if (!isset(o[p])) m.push(p)
    if (m.length) throw new DescriptiveError(`requiredVariableEmptyOrNotSet`, { code: 422, origin: 'Validator', varNames: m.join(', ') })
}

export async function tryCatch(callback: Function, onErr: Function = () => { }) {
    try {
        return await callback()
    } catch (err) {
        return await onErr(err)
    }
}




function extraInfosRendererDefault(extraInfos) {
    C.error(false, '== EXTRA INFOS ==')
    C.error(false, JSON.stringify(extraInfos, null, 2))
}

export class DescriptiveError extends Error {
    errorDescription: { [k: string]: any }
    code: number
    msg: string
    options: ErrorOptions
    hasBeenLogged: boolean

    constructor(msg: string, options: ErrorOptions = {}) {
        super(msg)
        delete options.errMsgId
        this.msg = msg
        const { doNotWaitOneFrameForLog = false, ...optionsClean } = options
        this.options = optionsClean
        if (optionsClean.err) optionsClean.err.hasBeenLogged = true
        this.hasBeenLogged = false
        if (doNotWaitOneFrameForLog) this.log()
        else setTimeout(() => {
            if (!this.hasBeenLogged) this.log() // wait one event loop to see if not catched
        })

        const { onError = () => { } } = configFn()
        onError(msg, options)
    }
    log(doNotCountHasLogged = false) {
        if (!this.hasBeenLogged) {
            const { err, doNotThrow = false, noStackTrace = false, ressource, extraInfosRenderer = extraInfosRendererDefault, notifyOnSlackChannel = false, originalMessage, ...extraInfosRaw } = this.options
            let { code } = this.options
            const extraInfos = { ...extraInfosRaw, ...(this.options.extraInfos || {}) }

            if (!isset(extraInfos.value) && this.options.hasOwnProperty('value')) extraInfos.value = 'undefined'
            if (!isset(extraInfos.gotValue) && this.options.hasOwnProperty('gotValue')) extraInfos.gotValue = 'undefined'

            if (isset(ressource)) {
                code = 404
                if (this.msg === '404') this.msg = `Ressource ${ressource} not found`
                extraInfos.ressource = ressource
            }

            C.error(false, this.msg || this.message)
            if (Object.keys(extraInfos).length > 0) extraInfosRenderer(extraInfos)
            if (err) {
                C.error(false, '== ORIGINAL ERROR ==')
                if (err.log) {
                    err.hasBeenLogged = false
                    err.log()
                } else {
                    logErr(noStackTrace, err)
                    if (err.extraInfos) logErr(noStackTrace, err.extraInfos)
                }
            } else {
                if (!noStackTrace) C.error(false, C.dim(cleanStackTrace(extraInfosRaw.stack || this.stack)))
            }
            this.code = code || 500
            if (this.options.doNotDisplayCode || (this.options.hasOwnProperty('code') && !isset(this.options.code))) delete this.code
            this.errorDescription = {
                msg: this.msg,
                code,
                ressource,
                ...extraInfos,
            }
        }
        if (!doNotCountHasLogged) this.hasBeenLogged = true
    }
    toString() {
        return this.log(true)
    }
}

function logErr(noStackTrace: boolean, ...params: any[]) {
    if (noStackTrace) C.error(false, ...params)
    else C.error(...params)
}