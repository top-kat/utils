//----------------------------------------
// REGEXP UTILS
//----------------------------------------
import { C } from "./logger-utils"

export function escapeRegexp(str: string, config: { parseStarChar?: boolean } = {}): string {
    const { parseStarChar = false } = config
    if (parseStarChar) return str.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.*')
    else return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

/** Get first match of the first capturing group of regexp
 * Eg: const basePath = firstMatch(apiFile, /basePath = '(.*?)'/); will get what is inside quotes
 */
export function firstMatch(str: string, regExp: RegExp): string | undefined { return (str.match(regExp) || [])[1] }

/** Get all matches from regexp with g flag
 * Eg: [ [full, match1, m2], [f, m1, m2]... ]
 * NOTE: the G flag will be appended to regexp
 */
export function allMatches(str: string, reg: RegExp): string[] {
    let i = 0
    let matches
    const arr = []
    if (typeof str !== 'string') C.error('Not a string provided as first argument for allMatches()')
    else {
        reg = new RegExp(reg, 'g')
        while ((matches = reg.exec(str))) {
            arr.push(matches)
            if (i++ > 99) {
                C.error('error', 'Please provide the G flag in regexp for allMatches')
                break
            }
        }
    }
    return arr
}