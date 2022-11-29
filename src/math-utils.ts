//----------------------------------------
// MATH UTILS
//----------------------------------------
import { isset } from "./isset"

/** Round with custom number of decimals (default:0) */
export function round(number: number | string, decimals = 0) { return Math.round((typeof number === 'number' ? number : parseFloat(number)) * Math.pow(10, decimals)) / Math.pow(10, decimals) }
/** Round with custom number of decimals (default:2) */
export function round2(number: number | string, decimals = 2) { return round(number, decimals) }

/** Is number between two numbers (including those numbers) */
export function isBetween(number: number, min: number, max: number, inclusive = true) { return inclusive ? number <= max && number >= min : number < max && number > min }

/** Random number between two values with 0 decimals by default */
export function random(nb1: number, nb2: number, nbOfDecimals = 0) { return round(Math.random() * (nb2 - nb1) + nb1, nbOfDecimals) }

/** Sum all values of an array, all values MUST be numbers */
export function sumArray(array: number[]) {
    return array.filter(item => typeof item === 'number').reduce((sum, val) => isset(val) ? val + sum : sum, 0)
}

/** Moyenne / average between array of values 
 * @param {Number} round number of decimals to keep. Default:2
*/
export function moyenne(array: number[], nbOfDecimals = 2) {
    return round(sumArray(array) / array.length, nbOfDecimals)
}

/** length default 2, shortcut for 1 to 01 */
export function pad(numberOrStr: number | string, length = 2) { return ('' + numberOrStr).padStart(length, '0') }

/** return the number or the closest number of the range
 * * nb min max  => returns
 * * 7  5   10   => 7 // in the range
 * * 2  5   10   => 5 // below the min value
 * * 99 5   10   => 10// above the max value
 */
export function minMax(nb: number, min: number, max: number) { return Math.max(min, Math.min(nb, max)) }
