//----------------------------------------
// VALIDATION UTILS
//----------------------------------------
import { dataValidationUtilErrorHandler } from "./private/error-handler"
import { isset } from "./isset"
import { isDateIsoOrObjectValid, isDateIntOrStringValid, isTimeStringValid } from "./date-utils"
import { asArray } from "./array-utils"
import { configFn } from "./private/config"
import { isEmpty } from "./is-empty"
import { removeCircularJSONstringify } from "./remove-circular-json-stringify"

export type BaseTypes = 'objectId' | 'dateInt6' | 'dateInt' | 'dateInt8' | 'dateInt12' | 'time' | 'humanReadableTimestamp' | 'date' | 'dateObject' | 'array' | 'object' | 'buffer' | 'string' | 'function' | 'boolean' | 'number' | 'bigint' | 'year' | 'email' | 'any'

export function issetOr(...elms) { return elms.some(elm => typeof elm !== 'undefined' && elm !== null) }

export function isEmptyOrNotSet(...elms) { return elms.some(elm => !isset(elm) || isEmpty(elm)) }

export function isDateObject(variable) { return variable instanceof Date }

/** Check all values are set */
export function checkAllObjectValuesAreEmpty(o) { return Object.values(o).every(value => !isset(value)) }

/** Throw an error in case data passed is not a valid ctx */
export function checkCtxIntegrity(ctx) {
    if (!isset(ctx) || !isset(ctx.user)) throw new dataValidationUtilErrorHandler('ctxNotSet', 500)
}

/**
## VALIDATOR

@name validator

@description support multiple names, multiple values and multiple type check
@option if nameString ends by $ sign it is considered optional

@function validator([Objects])
@return {error|true/false|testMode} depend on mode (see prop mode)
@param {} mode normal (default) | test (TODO) | boolean
@param {} name 'myName' || [{myVar1: 'blah, myvar2: myvar2}], support multiple names / values
@param {} value myVar,
@param {string} myVar myVar, instead of name / value
@param {array} in ['blah', 'otherPossibleValue', true], equal ONE OF THESE values
@param {any} eq exactly equal to in, both support string or array of values
@param {any} neq not in, both support string or array of values
@param {number} lte 3, less than or equal
@param {number} gte 1, greater or equal
@param {number} lt 3, less than
@param {number} gt 1, greater
@param {string|string[]} type
 * possibleTypes: object, number, string, boolean, array, date, dateInt8, dateInt12, dateInt6, time, objectId (mongo), humanReadableTimestamp, buffer
 * Notes: multiples value is an OR, /!\ Array is type 'array' and not 'object' like in real JS /!\
@param {regExp} regexp /regexp/, test against regexp
@param {number} minLength for string, array or number length
@param {number} maxLength
@param {number} length
@param {boolean} optional default false
@param {boolean} emptyAllowed default false (to use if must be set but can be empty)
@param {boolean} mustNotBeSet this one must not be set
@param {any} includes check if array or string includes value (like js .includes())

@example
    validator(
        { myNumber : 3, type: 'number', gte: 1, lte: 3 }, // use the name directly as a param
        { name: 'email', value: 'nameATsite.com', regexp: /[^\sAT]+AT[^\sAT]+\.[^\sAT]/},
        { name: [{'blahVar': blahVarValue, 'myOtherVar': myOtherVarValue}], type: 'string'} // multiple names for same check
    )
----------------------------------------*/

export type ValidatorObject = {
    name?: string
    value?: any
    type?: BaseTypes
    eq?: any
    neq?: any
    in?: any[]
    lt?: number
    gt?: number
    lte?: number
    gte?: number
    length?: number
    minLength?: number
    maxLength?: number
    emptyAllowed?: boolean
    regexp?: RegExp
    mustNotBeSet?: boolean
    isset?: boolean
    optional?: boolean
    isArray?: boolean
    [k: string]: any
}
export function validator(...paramsToValidate: ValidatorObject[]) {
    const errArray = validatorReturnErrArray(...paramsToValidate)
    if (errArray.length) throw new dataValidationUtilErrorHandler(...errArray)
}


/** Same as validator but return a boolean
 * See {@link validator}
 */
export function isValid(...paramsToValidate) {
    const errArray = validatorReturnErrArray(...paramsToValidate)
    return errArray.length ? false : true
}

/** Default types + custom types
 * 'objectId','dateInt6','dateInt','dateInt8','dateInt12','time','humanReadableTimestamp','date','array','object','buffer','string','function','boolean','number','bigint',
 */
export function isType(value, type: BaseTypes) { return isValid({ name: 'Is type check', value, type }) }

export function validatorReturnErrArray(...paramsToValidate: ValidatorObject[]): [string?, number?, object?] {
    let paramsFormatted: ValidatorObject[] = []

    // support for multiple names with multiple values for one rule. Eg: {name: [{startDate:'20180101'}, {endDate:'20180101'}], type: 'dateInt8'}
    paramsToValidate.forEach(param => {
        if (typeof param !== 'object' || Array.isArray(param))
            throw new dataValidationUtilErrorHandler(`wrongTypeForDataValidatorArgument`, 500, { origin: 'Generic validator', expected: 'object', actualType: Array.isArray(param) ? 'array' : typeof param })

        // parse => name: {myVar1: 'blah, myvar2: myvar2}
        if (typeof param.name === 'object' && !Array.isArray(param.name))
            Object.keys(param.name).forEach(name => paramsFormatted.push(Object.assign({}, param, { name: name, value: param.name[name] })))
        else paramsFormatted.push(param)
    })

    for (const paramObj of paramsFormatted) {
        let name = paramObj.name
        let value = paramObj.value
        let optional = paramObj.optional || false
        let emptyAllowed = optional || paramObj.emptyAllowed || false
        if (paramObj.isset === false) paramObj.mustNotBeSet = true // ALIAS 
        const errMess = (msg, extraInfos = {}, errCode = 422): [string, number, object] => [msg, errCode, { origin: 'Generic validator', varName: name, gotValue: isset(value) && isset(value.data) && isset(value.data.data) ? { ...value, data: 'Buffer' } : value, ...extraInfos }]

        // accept syntax { 'myVar.var2': myVar.var2, ... }
        if (!isset(name)) {
            name = Object.keys(paramObj).find(param => !['in', 'eq', 'lte', 'gte', 'name', 'value', 'type', 'regexp', 'minLength', 'maxLength', 'optional', 'emptyAllowed', 'mustNotBeSet', 'includes', 'length'].includes(param))
            if (isset(name)) value = paramObj[name] // throw new dataValidationUtilErrorHandler('noNameProvidedForDataValidator', 500, { origin: 'Generic validator', });
        }
        // if nameString ends by $ sign it is optional
        if (isset(name) && /.*\$$/.test(name)) {
            name = name.substr(0, name.length - 1)
            optional = true
        }

        // DEFINED AND NOT EMPTY
        if (!isset(value) && optional) continue
        if (isset(value) && paramObj.mustNotBeSet) return errMess('variableMustNotBeSet')
        if (paramObj.mustNotBeSet) continue // exit
        if (!isset(value)) return errMess('requiredVariableEmptyOrNotSet')
        if (!emptyAllowed && value === '') return errMess('requiredVariableEmpty')

        const isArray = paramObj.isArray
        if (isArray && !Array.isArray(value)) return errMess('wrongTypeForVar', { expectedTypes: 'array', gotType: typeof value })

        // TYPE
        if (isset(paramObj.type)) {
            const types = asArray(paramObj.type) // support for multiple type
            const areSomeTypeValid = types.some(type => {
                if (type.endsWith('[]')) {
                    if (!Array.isArray(value)) errMess('wrongTypeForVar', { expectedTypes: 'array', gotType: typeof value })
                    type = type.replace('[]', '')
                }

                const allTypes: Array<BaseTypes> = [
                    'objectId',
                    'dateInt6',
                    'dateInt', // alias for dateInt8
                    'dateInt8',
                    'dateInt12',
                    'time',
                    'humanReadableTimestamp',
                    'date',
                    'dateObject', // alias
                    'array',
                    'object',
                    'buffer',
                    'string',
                    'function',
                    'boolean',
                    'number',
                    'bigint',
                    'year',
                    'any',
                    'email',
                    //...Object.keys(configFn().customTypes)
                ]

                if (!allTypes.includes(type)) throw new dataValidationUtilErrorHandler('typeDoNotExist', 500, { type })

                const basicTypeCheck = {
                    objectId: val => /^[0-9a-fA-F-]{24,}$/.test(val), // "0c65940b-6b0c-4dd8-9c7a-7c5fe1ba907a"
                    dateInt6: val => isDateIntOrStringValid(parseInt(val + '01'), true, 8),
                    dateInt: val => isDateIntOrStringValid(val, true, 8),
                    dateInt8: val => isDateIntOrStringValid(val, true, 8),
                    dateInt12: val => isDateIntOrStringValid(val, true, 12),
                    time: val => /^\d\d:\d\d$/.test(val) && isTimeStringValid(val),
                    humanReadableTimestamp: val => (val + '').length === 17,
                    date: val => isDateIsoOrObjectValid(val, true),
                    dateObject: val => isDateIsoOrObjectValid(val, true),
                    array: val => Array.isArray(val),
                    object: val => !Array.isArray(val) && val !== null && typeof val === type,
                    buffer: val => Buffer.isBuffer(val),
                    year: val => /^\d\d\d\d$/.test(val),
                    email: val => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]+$/.test(val),
                    any: () => true,
                }

                return isset(basicTypeCheck[type]) && basicTypeCheck[type](value) ||
                    typeof value === type && type !== 'object' || // for string, number, boolean...
                    isset(configFn().customTypes[type]) && configFn().customTypes[type].test(value)
            })
            if (!areSomeTypeValid) return errMess(`wrongTypeForVar`, { expectedTypes: types.join(', '), gotType: Object.prototype.toString.call(value), gotValue: removeCircularJSONstringify(value) })
        }

        // GREATER / LESS
        if (isset(paramObj.gte) && value < paramObj.gte) return errMess(`valueShouldBeSuperiorOrEqualForVar`, { shouldBeSupOrEqTo: paramObj.gte })
        if (isset(paramObj.lte) && value > paramObj.lte) return errMess(`valueShouldBeInferiorOrEqualForVar`, { shouldBeInfOrEqTo: paramObj.lte })
        if (isset(paramObj.gt) && value <= paramObj.gt) return errMess(`valueShouldBeSuperiorForVar`, { shouldBeSupOrEqTo: paramObj.gt })
        if (isset(paramObj.lt) && value >= paramObj.lt) return errMess(`valueShouldBeInferiorForVar`, { shouldBeInfOrEqTo: paramObj.lt })

        // IN VALUES
        if (isset(paramObj.in)) {
            const equals = Array.isArray(paramObj.in) ? paramObj.in : [paramObj.in]
            if (!equals.some(equalVal => equalVal === value)) return errMess(`wrongValueForVar`, { supportedValues: JSON.stringify(equals) })
        }

        // EQUAL (exact copy of .in)
        if (paramObj.hasOwnProperty('eq')) {
            const equals = Array.isArray(paramObj.eq) ? paramObj.eq : [paramObj.eq]
            if (!equals.some(equalVal => equalVal === value)) return errMess(`wrongValueForVar`, { supportedValues: equals.join(', '), })
        }

        // NOT EQUAL
        if (paramObj.hasOwnProperty('neq')) {
            const notEquals = Array.isArray(paramObj.neq) ? paramObj.neq : [paramObj.neq]
            if (notEquals.some(equalVal => equalVal === value)) return errMess(`wrongValueForVar`, { NOTsupportedValues: notEquals.join(', ') })
        }

        // INCLUDES
        if (isset(paramObj.includes) && !value.includes(paramObj.includes))
            return errMess(`wrongValueForVar`, { shouldIncludes: paramObj.includes })

        // REGEXP
        if (isset(paramObj.regexp) && !paramObj.regexp.test(value))
            return errMess(`wrongValueForVar`, { shouldMatchRegexp: paramObj.regexp.toString() })

        // MIN / MAX LENGTH works for number length. Eg: 20180101.length == 8
        if (isset(paramObj.minLength) && paramObj.minLength > (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { minLength: paramObj.minLength })
        if (isset(paramObj.maxLength) && paramObj.maxLength < (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { maxLength: paramObj.maxLength })
        if (isset(paramObj.length) && paramObj.length !== (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { length: paramObj.length })
    }

    return []
}

