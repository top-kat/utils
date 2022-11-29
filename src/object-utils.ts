//----------------------------------------
// OBJECT UTILS
//----------------------------------------
import { ObjectGeneric } from "./private/types"
import { err500IfNotSet } from "./error-utils"
import { recursiveGenericFunctionSync } from "./loop-utils"
import { isset } from "./isset"
import { isObject } from "./is-object"
import { dataValidationUtilErrorHandler } from "./private/error-handler"

/**
 * 
 * @param {Object} object main object
 * @param {String[]} maskedOrSelectedFields array of fields
 * @param {Boolean} isMask default: true; determine the behavior of the function. If is mask, selected fields will not appear in the resulting object. If it's a select, only selected fields will appear.
 * @param {Boolean} deleteKeysInsteadOfReturningAnewObject default:false; modify the existing object instead of creating a new instance
 */
export function simpleObjectMaskOrSelect(object: ObjectGeneric, maskedOrSelectedFields: string[], isMask = true, deleteKeysInsteadOfReturningAnewObject = false) {
    const allKeys = Object.keys(object)
    const keysToMask = allKeys.filter(keyName => {
        if (isMask) return maskedOrSelectedFields.includes(keyName)
        else return !maskedOrSelectedFields.includes(keyName)
    })
    if (deleteKeysInsteadOfReturningAnewObject) {
        keysToMask.forEach(keyNameToDelete => delete object[keyNameToDelete])
        return object
    } else {
        return allKeys.reduce((newObject, key) => {
            if (!keysToMask.includes(key)) newObject[key] = object[key]
            return newObject
        }, {})
    }
}

/**
 * check if **object OR array** has property Safely (avoid cannot read property x of null and such)
 * @param {Object} obj object to test against
 * @param {string} addr `a.b.c.0.1` will test if myObject has props a that has prop b. Work wit arrays as well (like `arr.0`)
 */
export function has(obj: ObjectGeneric, addr: string) {
    if (!isset(obj) || typeof obj !== 'object') return
    let propsArr = addr.replace(/\.?\[(\d+)\]/g, '.$1').split('.') // replace a[3] => a.3;
    let objChain = obj
    return propsArr.every(prop => {
        objChain = objChain[prop]
        return isset(objChain)
    })
}

/** Find address in an object "a.b.c" IN { a : { b : {c : 'blah' }}} RETURNS 'blah'
 * @param obj
 * @param addr accept syntax like "obj.subItem.[0].sub2" OR "obj.subItem.0.sub2" OR "obj.subItem[0].sub2"
 * @returns the last item of the chain OR undefined if not found
 */
export function findByAddress(obj: ObjectGeneric, addr: string): any | undefined {
    if (addr === '') return obj
    if (!isset(obj) || typeof obj !== 'object') return console.warn('Main object in `findByAddress` function is undefined or has the wrong type')
    const propsArr = addr.replace(/\.?\[(\d+)\]/g, '.$1').split('.') // replace .[4] AND [4] TO .4
    const objRef = propsArr.reduce((objChain, prop) => {
        if (!isset(objChain) || typeof objChain !== 'object' || !isset(objChain[prop])) return
        else return objChain[prop]
    }, obj)
    return objRef
}


/** Will return all objects matching that path. Eg: user.*.myVar */
export function findByAddressAll(obj, addr, returnAddresses?: true): Array<[string, any]>
export function findByAddressAll(obj, addr, returnAddresses?: false): Array<any>
export function findByAddressAll(obj, addr, returnAddresses = false) {
    err500IfNotSet({ obj, addr })
    if (addr === '') return obj
    const addrRegexp = new RegExp('^' + addr
        .replace(/\.?\[(\d+)\]/g, '.$1') // replace .[4] AND [4] TO .4
        .replace(/\./g, '\\.')
        .replace(/\.\*/g, '.[^.]+') // replace * by [^. (all but a point)]
        + '$')

    const matchingItems = []

    recursiveGenericFunctionSync(obj, (item, address) => {
        if (addrRegexp.test(address)) matchingItems.push(returnAddresses ? [address, item] : item)
    })
    return matchingItems
}

/** Enforce writing subItems. Eg: user.name.blah will ensure all are set until the writing of the last item
 * NOTE: doesn't work with arrays
 */
export function objForceWrite(obj: ObjectGeneric, addr: string, item) {
    const chunks = addr.replace(/\.?\[(\d+)\]/g, '.[$1').split('.')
    let lastItem = obj
    chunks.forEach((chunkRaw, i) => {
        const chunk = chunkRaw.replace(/^\[/, '')
        if (i === chunks.length - 1) lastItem[chunk] = item
        else if (!isset(lastItem[chunk])) {
            const nextChunk = chunks[i + 1]
            if (isset(nextChunk) && nextChunk.startsWith('[')) lastItem[chunk] = []
            else lastItem[chunk] = {}
        } else if (typeof lastItem[chunk] !== 'object') throw new dataValidationUtilErrorHandler(`itemNotTypeObjectOrArrayInAddrChainForObjForceWrite`, 500, { origin: 'Validator', chunks, actualValueOfItem: lastItem[chunk], actualChunk: chunk })
        lastItem = lastItem[chunk]
    })
}

/** Enforce writing subItems, only if obj.addr is empty.
 * Eg: user.name.blah will ensure all are set until the writing of the last item
 * if user.name.blah has a value it will not change it.
 * NOTE: doesn't work with arrays
 */
export function objForceWriteIfNotSet(obj: ObjectGeneric, addr: string, item) {
    if (!isset(findByAddress(obj, addr))) return objForceWrite(obj, addr, item)
}

/** Merge mixins into class. Use it in the constructor like: mergeMixins(this, {myMixin: true}) */
export function mergeMixins(that, ...mixins) {
    mixins.forEach(mixin => {
        for (const method in mixin) {
            that[method] = mixin[method]
        }
    })
}

export function cloneObject(o) {
    return JSON.parse(JSON.stringify(o))
}

/** Deep clone. WILL REMOVE circular references */
export function deepClone<T>(obj: T, cache = []): T {

    let copy
    // usefull to not modify 1st level objet by lower levels
    // this is required for the same object to be referenced not in a redundant way
    const newCache = [...cache]
    if (obj instanceof Date) return new Date(obj) as any

    // Handle Array
    if (Array.isArray(obj)) {
        if (newCache.includes(obj)) return [] as any
        newCache.push(obj)
        copy = []
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i], newCache)
        }
        return copy
    }

    if (typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype) {
        if (newCache.includes(obj)) return {} as any
        newCache.push(obj)
        copy = {}
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key], newCache)
            }
        }
        return copy
    }

    return obj // number, string...
}


/**
 * @param {Object} obj the object on which we want to filter the keys
 * @param {function} filterFunc function that returns true if the key match the wanted criteria
 */
export function filterKeys(obj: object, filter) {
    const clone = cloneObject(obj)
    recursiveGenericFunctionSync(obj, (item, addr, lastElementKey) => {
        if (!filter(lastElementKey)) deleteByAddress(clone, addr.split('.'))
    })
    return clone
}
/**
 * @param {Object} obj the object on which we want to delete a property
 * @param {Array} addr addressArray on which to delete the property
 */
export function deleteByAddress(obj: object, addr: string[]) {
    let current = obj
    for (let i = 0; i < addr.length - 2; i++) current = current[addr[i]]
    delete current[addr[addr.length - 1]]
}



/** Remove all key/values pair if value is undefined  */
export function objFilterUndefined(o) {
    Object.keys(o).forEach(k => !isset(o[k]) && delete o[k])
    return o
}

/** Lock all 1st level props of an object to read only */
export function readOnly(o) {
    const throwErr = () => { throw new dataValidationUtilErrorHandler('Cannot modify object that is read only', 500) }
    return new Proxy(o, {
        set: throwErr,
        defineProperty: throwErr,
        deleteProperty: throwErr,
    })
}

/** Fields of the object can be created BUT NOT reassignated */
export function reassignForbidden(o) {
    return new Proxy(o, {
        defineProperty: function (that, key, value) {
            if (key in that) throw new dataValidationUtilErrorHandler(`Cannot reassign the property ${key.toString()} of this object`, 500)
            else {
                that[key] = value
                return true
            }
        },
        deleteProperty: function (_, key) {
            throw new dataValidationUtilErrorHandler(`Cannot delete the property ${key.toString()} of this object`, 500)
        }
    })
}

/** All fileds and subFields of the object will become readOnly */
export function readOnlyForAll(object) {
    recursiveGenericFunctionSync(object, (item, _, lastElementKey, parent) => {
        if (typeof item === 'object') parent[lastElementKey] = readOnly(item)
    })
    return object
}

export function objFilterUndefinedRecursive(obj) {
    if (obj) {
        const flattenedObj = flattenObject(obj)
        Object.keys(flattenedObj).forEach(key => {
            if (!isset(flattenedObj[key])) {
                delete flattenedObj[key]
            }
        })
        return unflattenObject(flattenedObj)
    } else return obj
}

export function sortObjKeyAccordingToValue(unorderedObj, ascending = true) {
    const orderedObj = {}
    const sortingConst = ascending ? 1 : -1
    Object.keys(unorderedObj)
        .sort((keyA, keyB) => unorderedObj[keyA] < unorderedObj[keyB] ? sortingConst : -sortingConst)
        .forEach(key => { orderedObj[key] = unorderedObj[key] })
    return orderedObj
}

/**
 * Make default value if object key do not exist
 * @param {object} obj
 * @param {string} addr
 * @param {any} defaultValue
 * @param {function} callback (obj[addr]) => processValue. Eg: myObjAddr => myObjAddr.push('bikou')
 * @return obj[addr] eventually processed by the callback
 */
export function ensureObjectProp(obj: object, addr: string, defaultValue, callback = o => o) {
    err500IfNotSet({ obj, addr, defaultValue, callback })
    if (!isset(obj[addr])) obj[addr] = defaultValue
    callback(obj[addr])
    return obj[addr]
}


/** object and array merge
 * @warn /!\ Array will be merged and duplicate values will be deleted /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified*/
export function mergeDeep(...objects) {
    return mergeDeepConfigurable(
        (previousVal, currentVal) => [...previousVal, ...currentVal].filter((elm, i, arr) => arr.indexOf(elm) === i),
        (previousVal, currentVal) => mergeDeep(previousVal, currentVal),
        undefined,
        ...objects
    )
}

/** object and array merge
 * @warn /!\ Array will be replaced by the latest object /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified */
export function mergeDeepOverrideArrays(...objects) {
    return mergeDeepConfigurable(
        undefined,
        (previousVal, currentVal) => mergeDeepOverrideArrays(previousVal, currentVal),
        undefined,
        ...objects
    )
}

/** object and array merge
 * @param {Function} replacerForArrays item[key] = (prevValue, currentVal) => () When 2 values are arrays,
 * @param {Function} replacerForObjects item[key] = (prevValue, currentVal) => () When 2 values are objects,
 * @param {Function} replacerDefault item[key] = (prevValue, currentVal) => () For all other values
 * @param  {...Object} objects
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified
 */
export function mergeDeepConfigurable(replacerForArrays = (prev, curr) => curr, replacerForObjects, replacerDefault = (prev, curr) => curr, ...objects) {
    return objects.reduce((actuallyMerged, obj) => {
        Object.keys(obj).forEach(key => {
            const previousVal = actuallyMerged[key]
            const currentVal = obj[key]

            if (Array.isArray(previousVal) && Array.isArray(currentVal)) {
                actuallyMerged[key] = replacerForArrays(previousVal, currentVal)
            } else if (isObject(previousVal) && isObject(currentVal)) {
                actuallyMerged[key] = replacerForObjects(previousVal, currentVal)
            } else {
                actuallyMerged[key] = replacerDefault(previousVal, currentVal)
            }
        })

        return actuallyMerged
    }, {})
}

/** { a: {b:2}} => {'a.b':2} useful for translations
 * NOTE: will remove circular references
 */
export function flattenObject(data, config: { withoutArraySyntax?: boolean, withArraySyntaxMinified?: boolean } = {}) {
    const { withoutArraySyntax = false, withArraySyntaxMinified = false } = config
    const result = {}
    const seenObjects = [] // avoidCircular reference to infinite loop
    const recurse = (cur, prop) => {
        if (Array.isArray(cur)) {
            let l = cur.length
            let i = 0
            if (withoutArraySyntax) recurse(cur[0], prop)
            else {
                for (; i < l; i++) recurse(cur[i], prop + (withArraySyntaxMinified ? `.${i}` : `[${i}]`))
                if (l == 0) result[prop] = []
            }
        } else if (isObject(cur)) { // is object
            try {
                if (seenObjects.includes(cur)) cur = deepClone(cur) // avoid circular ref but allow duplicate objects
                else seenObjects.push(cur)

                const isEmpty = Object.keys(cur).length === 0

                for (const p in cur) recurse(cur[p], (prop ? prop + '.' : '') + p.replace(/\./g, '%')) // allow prop to contain special chars like points);

                if (isEmpty && prop) result[prop] = {}
            } catch (error) {
                console.warn('Circular reference in flattenObject, impossible to parse')
            }
        } else result[prop] = cur
    }
    recurse(data, '')
    return result
}

/** {'a.b':2} => { a: {b:2}} */
export function unflattenObject(data) {
    const newO = {}
    for (const [addr, value] of Object.entries(data)) objForceWrite(newO, addr, value)
    return newO
}