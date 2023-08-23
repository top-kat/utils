//----------------------------------------
// ERROR UTILS
//----------------------------------------
import { configFn } from './config'
import { isset } from './isset'
import { isEmpty } from './is-empty'
import { ErrorOptions } from './types'
import { cleanStackTrace } from './clean-stack-trace'
import { C } from './logger-utils'
export { type ErrorOptions } from './types'

export function errIfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, false, objOfVarNamesWithValues) }

export function err500IfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, false, objOfVarNamesWithValues) }

export function errIfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, true, objOfVarNamesWithValues) }

export function err500IfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, true, objOfVarNamesWithValues) }

export function errXXXIfNotSet(errCode, checkEmpty, objOfVarNamesWithValues) {
    const missingVars: string[] = []
    for (const prop in objOfVarNamesWithValues) {
        if (!isset(objOfVarNamesWithValues[prop]) || (checkEmpty && isEmpty(objOfVarNamesWithValues[prop]))) missingVars.push(prop)
    }
    if (missingVars.length) throw new DescriptiveError(`requiredVariableEmptyOrNotSet`, { code: errCode, origin: 'Validator', varNames: missingVars.join(', ') })
}


export function err422IfNotSet(o) {
    const m: any[] = []
    for (const p in o) if (!isset(o[p])) m.push(p)
    if (m.length) throw new DescriptiveError(`requiredVariableEmptyOrNotSet`, { code: 422, origin: 'Validator', varNames: m.join(', ') })
}

/** Works natively with sync AND async functions */
export function tryCatch<T>(callback: () => T, onErr: Function = () => { /** */ }): T {
    try {
        const result = callback()
        if (result instanceof Promise) return result.catch(e => onErr(e)) as T
        else return result
    } catch (err) {
        return onErr(err)
    }
}

export const failSafe = tryCatch // ALIAS

function extraInfosRendererDefault(extraInfos) {
    return [
        '== EXTRA INFOS ==',
        JSON.stringify(extraInfos, null, 2)
    ]
}

export class DescriptiveError extends Error {
    errorDescription: { [k: string]: any } = {}
    code?: number
    msg: string
    options: ErrorOptions
    hasBeenLogged = false
    logs: string[] = []

    constructor(msg: string, options: ErrorOptions = {}) {
        super(msg)
        delete options.errMsgId
        this.msg = msg
        const { doNotWaitOneFrameForLog = false, ...optionsClean } = options
        this.options = optionsClean
        if (optionsClean.err) optionsClean.err.hasBeenLogged = true

        this.parseError()

        this.hasBeenLogged = false
        if (doNotWaitOneFrameForLog) this.log()
        else setTimeout(() => {
            // wait one event loop because it can be catched in a parent module
            // and it can be logged manually sometimes
            if (!this.hasBeenLogged) this.log()
        })

        const { onError = () => { /** */ } } = configFn()
        onError(msg, options)

    }
    parseError(forCli = false) {

        const errorLogs: string[] = []

        const { err, noStackTrace = false, ressource, extraInfosRenderer = extraInfosRendererDefault, ...extraInfosRaw } = this.options
        let { code } = this.options
        const extraInfos = {
            ...extraInfosRaw,
            // additionnal extra info passed from parent error
            ...(this.options.extraInfos || {}),
        }

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

        if (Object.keys(extraInfos).length > 0) {
            errorLogs.push(...extraInfosRenderer(extraInfos))
        }

        if (err) {
            errorLogs.push('== ORIGINAL ERROR ==')
            if (typeof err.parseError === 'function') {
                err.hasBeenLogged = false
                const logFromOtherErr = err.parseError(forCli)
                errorLogs.push(...logFromOtherErr)
            } else {
                errorLogs.push(err.toString())
                if (!noStackTrace && err.stack) errorLogs.push(cleanStackTrace(err.stack))
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
        if (err) this.errorDescription.originalError = `${err.code ? err.code + ': ' : ''}${err.message || err.msg || err.toString()}`

        this.logs = errorLogs

        return errorLogs
    }
    log() {
        if (!this.hasBeenLogged) C.error(false, this.logs.join('\n'))
        this.hasBeenLogged = true
    }
    toString() {
        return this.logs.join('\n')
    }
}