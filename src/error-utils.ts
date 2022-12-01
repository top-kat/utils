//----------------------------------------
// ERROR UTILS
//----------------------------------------
import { dataValidationUtilErrorHandler } from "./private/error-handler"
import { isset } from "./isset"
import { isEmpty } from "./is-empty"

export function errIfNotSet(objOfVarNamesWithValues, additionalMessage) { return errXXXIfNotSet(422, false, objOfVarNamesWithValues) }

export function err500IfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, false, objOfVarNamesWithValues) }

export function errIfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, true, objOfVarNamesWithValues) }

export function err500IfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, true, objOfVarNamesWithValues) }

export function errXXXIfNotSet(errCode, checkEmpty, objOfVarNamesWithValues) {
    let missingVars = []
    for (let prop in objOfVarNamesWithValues) {
        if (!isset(objOfVarNamesWithValues[prop]) || (checkEmpty && isEmpty(objOfVarNamesWithValues[prop]))) missingVars.push(prop)
    }
    if (missingVars.length) throw new dataValidationUtilErrorHandler(`requiredVariableEmptyOrNotSet`, errCode, { origin: 'Validator', varNames: missingVars.join(', ') })
}


export function err422IfNotSet(o) {
    let m = []
    for (let p in o) if (!isset(o[p])) m.push(p)
    if (m.length) throw new dataValidationUtilErrorHandler(`requiredVariableEmptyOrNotSet`, 422, { origin: 'Validator', varNames: m.join(', ') })
}

export function cleanStackTrace(stack) {
    if (typeof stack !== 'string') return ''
    stack.replace(/home\/[^/]+\/[^/]+\//g, '')
    const lines = stack.split('\n')
    const removeIfContain = [
        'logger-utils.js',
        'TCP.onread',
        'readableAddChunk',
        'Socket.EventEmitter.emit (domain.js',
        'Socket.emit (events.js',
        'Connection.EventEmitter.emit (domain.js',
        'Connection.emit (events.js',
        'Socket.Readable.push (_stream_readable',
        'model.Query',
        'Object.promiseOrCallback',
        'Connection.<anonymous>',
        'process.topLevelDomainCallback',
        // internal
        'internal/process',
        'internal/timers',
        'internal/modules',
        'internal/main',
        'DefaultError.throw',
        'Object.throw',
        'mongoose/lib/utils',
        'at Array.forEach (<anonymous>)',
    ]
    const linesClean = lines
        .map((line, i) => {
            if (i === 0) return ''
            else {
                const [, start, fileName, end] = line.match(/(^.+\/)([^/]+:\d+:\d+)(.{0,3})/) || []
                return fileName ? `\x1b[2m${start}\x1b[0m${fileName}\x1b[2m${end}\x1b[0m` : `\x1b[2m${line}\x1b[0m`
            }
        })
        .filter(l => l && !removeIfContain.some(text => l.includes(text)))
        .join('\n')
    return linesClean
}

export async function tryCatch(callback: Function, onErr: Function = () => { }) {
    try {
        return await callback()
    } catch (err) {
        return await onErr(err)
    }
}