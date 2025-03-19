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
import { removeCircularJSONstringify } from './remove-circular-json-stringify'
import { generateToken } from './string-utils'
import { isObject } from './is-object'

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
        removeCircularJSONstringify({ ...extraInfos, msg: undefined, message: undefined }, 2)
    ]
}



export class DescriptiveError<ExpectedOriginalError = any> extends Error {
    /** Full error infos, extra infos + message and code...etc as object */
    errorDescription: {
        /** used to uniquely identify the error */
        id: string
        /** Http error code if any */
        code: number
        msg: string
        message: string
        /** The parent error if any */
        originalError?: Error | Record<string, any> | DescriptiveError
        [k: string]: any
    } = {} as any
    /** The parent error if any */
    originalError: ExpectedOriginalError = {} as any
    /** used to uniquely identify the error */
    id: string = generateToken(24, true)
    /** Http code. Eg: 404, 403... */
    code?: number
    msg: string
    /** Alias since .msg is not always obvious to find */
    message: string
    options: ErrorOptions
    /** Logging of the error is async, unless disabled, so that it wait one frame to allow to log it manually */
    hasBeenLogged = false
    isAxiosError = false
    doNotLog = false // just an alias for the above, actually using this one can be more readable in some situations
    logs: string[] = []

    constructor(msg: string, options: ErrorOptions = {}) {
        super(msg)
        delete options.errMsgId
        this.msg = msg
        this.message = msg

        this.isAxiosError = (options?.err?.stack || options.stack)?.startsWith('Axios') || false

        const { doNotWaitOneFrameForLog = options.code === 500, ...optionsClean } = options
        this.options = optionsClean
        if (optionsClean.err) {
            // ORIGINAL ERROR
            if (typeof optionsClean.err !== 'string') optionsClean.err.hasBeenLogged = true
            // get props from prototype to be in actual error object for further manipulation
            optionsClean.err = { message: optionsClean.err.message, stack: optionsClean.err.stack, ...optionsClean.err }
        }

        this.parseError() // make sure to parse it before any log or reuse

        this.hasBeenLogged = false

        if (doNotWaitOneFrameForLog) this.log()
        else setTimeout(() => {
            // wait one event loop because it can be catched in a parent module
            // and it can be logged manually sometimes
            if (!this.hasBeenLogged) this.log()
        })

        const { onError } = configFn()
        if (typeof onError === 'function') onError(msg, options)

    }
    /** Compute extraInfos and parse options */
    parseError(forCli = false) {

        const errorLogs: string[] = []

        const { err, noStackTrace = false, ressource, extraInfosRenderer = extraInfosRendererDefault, maskForFront, ...extraInfosRaw } = this.options
        let { code } = this.options
        const extraInfos = {
            id: this.id,
            ...extraInfosRaw,
            // additionnal extra info passed from parent error
            ...(this.options.extraInfos || {}),
        }

        this.code = code || 500

        if (this.options.doNotDisplayCode || (this.options.hasOwnProperty('code') && !isset(this.options.code))) delete this.code

        if (!isset(extraInfos.value) && this.options.hasOwnProperty('value')) extraInfos.value = 'undefined'
        if (!isset(extraInfos.gotValue) && this.options.hasOwnProperty('gotValue')) extraInfos.gotValue = 'undefined'

        this.isAxiosError = this.isAxiosError || (extraInfos?.err?.stack || extraInfos.stack || this.stack)?.startsWith('Axios') || false

        if (this.isAxiosError) {
            // trying to extract response
            extraInfos.responseData = err && 'response' in err ? err.response.data : extraInfos.response?.data
        }

        if (isset(ressource)) {
            code = 404
            if (this.msg === '404') this.msg = `Ressource ${ressource} not found`
            extraInfos.ressource = ressource
        }

        errorLogs.push(computeErrorMessage(this))

        const extraInfosForLogs = { ...extraInfos, ...(isObject(maskForFront) ? maskForFront : { maskForFront }) }
        if (Object.keys(extraInfosForLogs).length > 0) {
            errorLogs.push(...extraInfosRenderer(extraInfosForLogs))
        }

        if (err) {
            // actually, passing by there mean THE ERROR HAS BEEN CATCHED
            this.originalError = err
            errorLogs.push('== ORIGINAL ERROR ==')
            errorLogs.push(computeErrorMessage(err))
            if (typeof err.parseError === 'function') {
                // The catched error is a DescriptiveError so from
                // there we prevent further logs/ outpus from error
                err.hasBeenLogged = true // this will be logged in the child error so we dont want it to be logged twice
                err.doNotLog = true
                const logFromOtherErr = err.parseError(forCli)
                errorLogs.push(...logFromOtherErr)
            } else {
                errorLogs.push(removeCircularJSONstringify({ ...err, hasBeenLogged: undefined }))
                if (!noStackTrace && err.stack) errorLogs.push(cleanStackTrace(err.stack))
                if (err.extraInfos) errorLogs.push(removeCircularJSONstringify(err.extraInfos))
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
            id: this.id,
            msg: this.msg,
            message: this.msg,
            code,
            ressource,
            originalError: err,
            maskForFront,
            ...extraInfos,
        }

        this.logs = errorLogs

        return errorLogs
    }
    log() {
        this.parseError() // re parse it in case it has been updated from the outside (eg: adding extraInfos)
        if (this.hasBeenLogged === false && this.doNotLog === false) C.error(false, this.logs.join('\n'))
        this.hasBeenLogged = true
    }
    toString() {
        return this.logs.join('\n')
    }
    toJSON() {
        return this.toString()
    }
}

function computeErrorMessage(err) {
    return (err.code ? err.code + ' ' : '') + (err.msg || err.message)
}