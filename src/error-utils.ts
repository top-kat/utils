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
    return [
        '== EXTRA INFOS ==',
        JSON.stringify(extraInfos, null, 2)
    ]
}

export class DescriptiveError extends Error {
    errorDescription: { [k: string]: any }
    code: number
    msg: string
    options: ErrorOptions
    hasBeenLogged: boolean = false
    logs: string[] = []

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

        this.parseError()
    }
    parseError(forCli = false) {

        const errorLogs: string[] = []

        const { err, doNotThrow = false, noStackTrace = false, ressource, extraInfosRenderer = extraInfosRendererDefault, notifyOnSlackChannel = false, originalMessage, ...extraInfosRaw } = this.options
        let { code } = this.options
        const extraInfos = { ...extraInfosRaw, ...(this.options.extraInfos || {}) }

        this.code = code || 500
        if (this.options.doNotDisplayCode || (this.options.hasOwnProperty('code') && !isset(this.options.code))) delete this.code

        if (!isset(extraInfos.value) && this.options.hasOwnProperty('value')) extraInfos.value = 'undefined'
        if (!isset(extraInfos.gotValue) && this.options.hasOwnProperty('gotValue')) extraInfos.gotValue = 'undefined'

        if (isset(ressource)) {
            code = 404
            if (this.msg === '404') this.msg = `Ressource ${ressource} not found`
            extraInfos.ressource = ressource
        }

        errorLogs.push(this.msg || this.message)
        if (Object.keys(extraInfos).length > 0) extraInfosRenderer(extraInfos)
        if (err) {
            errorLogs.push('== ORIGINAL ERROR ==')
            if (typeof err.parseError === 'function') {
                err.hasBeenLogged = false
                const logFromOtherErr = err.parseError(forCli)
                errorLogs.push(...logFromOtherErr)
            } else {
                errorLogs.push(err.toString())
                if (!noStackTrace && err.stack) errorLogs.push(err.stack)
                if (err.extraInfos) errorLogs.push(err.extraInfos)
            }
        } else {
            if (!noStackTrace) {
                const stackTranceClean = cleanStackTrace(extraInfosRaw.stack || this.stack)
                errorLogs.push(forCli ? C.dim(stackTranceClean) : stackTranceClean)
            }
        }

        // THIS is used to access error as object
        this.code = code || 500
        if (this.options.doNotDisplayCode || (this.options.hasOwnProperty('code') && !isset(this.options.code))) delete this.code
        this.errorDescription = {
            msg: this.msg,
            code,
            ressource,
            ...extraInfos,
        }

        this.logs = errorLogs
    }
    log() {
        if (!this.hasBeenLogged) this.logs.forEach(errLine => C.error(false, errLine))
        this.hasBeenLogged = true
    }
    toString() {
        return this.logs.join('\n')
    }
}