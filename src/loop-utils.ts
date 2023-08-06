//----------------------------------------
// LOOP UTILS
//----------------------------------------
import { ObjectGeneric } from './types'
import { err500IfNotSet } from './error-utils'
import { isObject } from './is-object'

export function forI<T extends any[] | any>(nbIterations: number, callback: (number: number, previousValue, arrayOfPreviousValues: any[]) => T): T[] {
    const results: any[] = []
    for (let i = 0; i < nbIterations; i++) {
        const prevValue = results[results.length - 1]
        results.push(callback(i, prevValue, results))
    }
    return results
}

export async function forIasync<T extends any[] | any>(nbIterations: number, callback: (number) => T): Promise<T[]> {
    const results: any[] = []
    for (let i = 0; i < nbIterations; i++) {
        results.push(await callback(i))
    }
    return results
}



export type RecursiveCallback = (item: any, addr: string, lastElementKey: string | number, parent: ObjectGeneric | any[]) => false | any
export type RecursiveConfig = { disableCircularDependencyRemoval?: boolean }
/**
 * @param {any} item the first array or object or whatever you want to recursively browse
 * @param {function} callback the callback you want to apply on items including the main one
 *   * this callback has 2 arguments: (item, address) =>
 *   * `item` => the actual item
 *   * `addr` => the address of the item, not including root (Eg: subItem1.sub2.[3].[2]) array indexes are juste written as numbers
 *   * `lastElementKey` => the key of last item. May be a number if last item is an array
 *   * `parent` => reference the parent object as this is the only way of reassigning a value for the item. Eg: parent[lastElementKey] = myNewItem
 *   * **NOTE** => if a key of an item contains dots, they will be replaced by '%' in `addr`
 *   * **NOTE2** => if false is returned by the callback it will stop all other iterations (but not in an array)
 * @param {string} addr$ optional, the base address for the callback function
 * @param lastElementKey technical field
 * NOTE: will remove circular references
 * /!\ check return values
 */
export async function recursiveGenericFunction(item: ObjectGeneric | any[], callback: RecursiveCallback, config: RecursiveConfig = {}, addr$ = '', lastElementKey: string | number = '', parent?, techFieldToAvoidCircularDependency: any[] = []) {
    err500IfNotSet({ callback })

    if (!techFieldToAvoidCircularDependency.includes(item)) {
        const result = addr$ === '' ? true : await callback(item, addr$, lastElementKey, parent)

        if (result !== false) {
            if (Array.isArray(item)) {
                if (config?.disableCircularDependencyRemoval !== true) techFieldToAvoidCircularDependency.push(item)
                await Promise.all(item.map(
                    (e, i) => recursiveGenericFunction(e, callback, config, addr$ + '[' + i + ']', i, item, techFieldToAvoidCircularDependency)
                ))
            } else if (isObject(item)) {
                if (config?.disableCircularDependencyRemoval !== true) techFieldToAvoidCircularDependency.push(item)
                await Promise.all(Object.entries(item).map(
                    ([key, val]) => recursiveGenericFunction(val, callback, config, (addr$ ? addr$ + '.' : '') + key.replace(/\./g, '%'), key, item, techFieldToAvoidCircularDependency)
                ))
            }
        }
    }
    return item
}

/**
 * @param {any} item the first array or object or whatever you want to recursively browse
 * @param {function} callback the callback you want to apply on items including the main one
 *   * this callback has 2 arguments: (item, address) =>
 *   * `item` => the actual item
 *   * `addr` => the address of the item, not including root (Eg: subItem1.sub2.[3].[2]) array indexes are juste written as numbers
 *   * `lastElementKey` => the key of last item. May be a number if last item is an array
 *   * `parent` => reference the parent object as this is the only way of reassigning a value for the item. Eg: parent[lastElementKey] = myNewItem
 *   * **NOTE** => if a key of an item contains dots, they will be replaced by '%' in `addr`
 *   * **NOTE2** => if false is returned by the callback it will stop all other iterations (but not in an array)
 *   * **NOTE3** => to reassign a key use =>  parent[lastElementKey] = myNewItem
 * @param {string} addr$ optional, the base address for the callback function
 * @param lastElementKey technical field
 * NOTE: will remove circular references
 * /!\ check return values
 */
export function recursiveGenericFunctionSync(item: ObjectGeneric | any[], callback: RecursiveCallback, config: RecursiveConfig = {}, addr$ = '', lastElementKey: string | number = '', parent?, techFieldToAvoidCircularDependency: any[] = []) {
    err500IfNotSet({ callback })

    if (!techFieldToAvoidCircularDependency.includes(item)) {
        const result = addr$ === '' ? true : callback(item, addr$, lastElementKey, parent)

        if (result !== false) {
            if (Array.isArray(item)) {
                if (config?.disableCircularDependencyRemoval !== true) techFieldToAvoidCircularDependency.push(item) // do not up one level
                item.forEach((e, i) => recursiveGenericFunctionSync(e, callback, config, addr$ + '[' + i + ']', i, item, techFieldToAvoidCircularDependency))
            } else if (isObject(item)) {
                if (config?.disableCircularDependencyRemoval !== true) techFieldToAvoidCircularDependency.push(item)
                Object.entries(item).forEach(([key, val]) => recursiveGenericFunctionSync(val, callback, config, (addr$ ? addr$ + '.' : '') + key.replace(/\./g, '%'), key, item, techFieldToAvoidCircularDependency))
            }
        }
    }
    return item
}
