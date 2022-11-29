//----------------------------------------
// ARRAY UTILS
//----------------------------------------
import { ensureObjectProp, objForceWriteIfNotSet } from "./object-utils"
import { isset } from "./isset"

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}


/**
 * Maye sure obj[addr] is an array and push a value to it
 * @param {Object} obj parent object
 * @param {String} addr field name in parent
 * @param {Any} valToPush
 * @param {Boolean} onlyUniqueValues default:false; may be true or a comparision function; (a,b) => return true if they are the same like (a, b) => a.name === b.name
 * @return obj[addr] eventually processed by the callback
 */
export function ensureIsArrayAndPush(obj: object, addr: string, valToPush, onlyUniqueValues: Function) {
    return ensureObjectProp(obj, addr, [], objValue => {
        if (isset(onlyUniqueValues)) {
            let duplicateFound = false
            if (typeof onlyUniqueValues === 'function') duplicateFound = objValue.some(a => onlyUniqueValues(a, valToPush))
            else duplicateFound = objValue.includes(valToPush)
            if (!duplicateFound) objValue.push(valToPush)
        } else objValue.push(valToPush)
    })
}


/** If a string is provided, return it as array else return the value */
export function strAsArray(arrOrStr) {
    return typeof arrOrStr === 'string' ? [arrOrStr] : arrOrStr
}

/** If not an array provided, return the array with the value
 * /!\ NOTE /!\ In case the value is null or undefined, it will return that value
 */
export function asArray<T extends any[] | any>(item: T): T extends undefined ? undefined : T extends any[] ? T : T[] {
    return ((typeof item === 'undefined' ? item : Array.isArray(item) ? item : [item]) as T extends undefined ? undefined : T extends any[] ? T : T[])
}

/** Array comparison
 * @return {object} { inCommon, notInB, notInA }
 */
export function compareArrays(arrayA: any[], arrayB: any[], compare = (a, b) => a === b) {
    return {
        inCommon: getArrayInCommon(arrayA, arrayB, compare),
        notInB: getNotInArrayA(arrayB, arrayA, compare),
        notInA: getNotInArrayA(arrayA, arrayB, compare),
    }
}

/**
 * @return [] only elements that are both in arrayA and arrayB
 */
export function getArrayInCommon(arrayA = [], arrayB = [], compare = (a, b) => a === b): any[] {
    if (!Array.isArray(arrayA) || !Array.isArray(arrayB)) return []
    else return arrayA.filter(a => arrayB.some(b => compare(a, b)))
}

/**
 * @return [] only elements that are in arrayB and not in arrayA
 */
export function getNotInArrayA(arrayA = [], arrayB = [], compare = (a, b) => a === b): any[] {
    if (!Array.isArray(arrayA) && Array.isArray(arrayB)) return arrayB
    else if (!Array.isArray(arrayB)) return []
    else return arrayB.filter(b => !arrayA.some(a => compare(a, b)))
}

/**
 * @return [] only elements that are in neither arrayA and arrayB
 */
export function getArrayDiff(arrayA = [], arrayB = [], compare = (a, b) => a === b): any[] {
    return [...getNotInArrayA(arrayA, arrayB, compare), ...getNotInArrayA(arrayB, arrayA, compare)]
}

/** filter duplicate values in an array 
 * @param {function} comparisonFn default:(a, b) => a === b. A function that shall return true if two values are considered equal
 * @return {array|function}
 */
export function noDuplicateFilter(arr, comparisonFn = (a, b) => a === b): any[] {
    return arr.filter((a, i, arr) => arr.findIndex(b => comparisonFn(a, b)) === i)
}

/** Count number of occurence of item in array */
export function arrayCount(item: any, arr: any[]): number {
    return arr.reduce((total, item2) => item === item2 ? total + 1 : total, 0)
}

/**
 * Sort an array in an object of subArrays, no duplicate.
 * @param {Array} array 
 * @param {function} getFieldFromItem (itemOfArray) => field[String|Number]
 * tell me how you want to sort your Array
 */
export function arrayToObjectSorted(array, getFieldFromItem) {
    const res = {}

    array.forEach(item => {
        objForceWriteIfNotSet(res, getFieldFromItem(item), [])
        res[getFieldFromItem(item)].push(item)
    })

    return res
}

/**
 * @param {Function} comparisonFunction default: (itemToPush, itemAlreadyInArray) => itemToPush === itemAlreadyInArray; comparison function to consider the added item duplicate
 */
export function pushIfNotExist(arrayToPushInto, valueOrArrayOfValuesToBePushed, comparisonFunction = (a, b) => a === b): any[] {
    const valuesToPush = asArray(valueOrArrayOfValuesToBePushed).filter(a => !arrayToPushInto.some(b => comparisonFunction(a, b)))
    arrayToPushInto.push(...valuesToPush)
    return arrayToPushInto
}

export function isNotEmptyArray(arr): boolean {
    return Array.isArray(arr) && !!arr.length
}

export function randomItemInArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}