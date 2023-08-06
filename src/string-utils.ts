//----------------------------------------
// STRING UTILS
//----------------------------------------
import { err500IfEmptyOrNotSet } from "./error-utils"
import { ObjectGeneric } from "./types"
import { isset } from "./isset"

const getWordBits = (wb: string[] | [string[]]): string[] => Array.isArray(wb[0]) ? wb[0] : wb as any

/**Eg: camelCase */
export function camelCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map((w, i) => i === 0 ? w : capitalize1st(w)).join('')
}

/**Eg: snake_case
 * trimmed but not lowerCased
 */
export function snakeCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map(w => w.trim()).join('_')
}
/**Eg: kebab-case
 * trimmed AND lowerCased
 * undefined, null... => ''
 */
export function kebabCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map(w => w.trim().toLowerCase()).join('-')
}
/**Eg: PascalCase undefined, null... => '' */
export function pascalCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map((w, i) => capitalize1st(w)).join('')
}

/**Eg: Titlecase undefined, null... => '' */
export function titleCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return capitalize1st(wordBitsReal.filter(e => e).map(w => w.trim()).join(''))
}

/**Eg: UPPERCASE undefined, null... => '' */
export function upperCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map(w => w.trim().toUpperCase()).join('')
}

/**Eg: lowercase undefined, null... => '' */
export function lowerCase(...wordBits: string[] | [string[]]): string {
    const wordBitsReal = getWordBits(wordBits)
    return wordBitsReal.filter(e => e).map(w => w.trim().toLowerCase()).join('')
}

export function capitalize1st(str = ''): string { return str ? str[0].toUpperCase() + str.slice(1) : str }

export function camelCaseToWords(str: string): string[] {
    return str ? str.trim().replace(/([A-Z])/g, '-$1').toLowerCase().split('-') : []
}

/** GIVEN A STRING '{ blah;2}, ['nested,(what,ever)']' AND A SEPARATOR ",""
 *  This will return the content separated by first level of separators
 *  @return ["{ blah;2}", "['nested,(what,ever)']"]
 */
export function getValuesBetweenSeparator(str: string, separator: string, removeTrailingSpaces = true) {
    err500IfEmptyOrNotSet({ separator, str })
    const { outer } = getValuesBetweenStrings(str, separator, undefined, undefined, undefined, removeTrailingSpaces)
    return outer
}


/** GIVEN A STRING "a: [ 'str', /[^]]/, '[aa]]]str', () => [ nestedArray ] ], b: ['arr']"
 * @return matching: [ "'str', /[^]]/, '[aa]]]str', () => [ nestedArray ]", "'arr'" ], between: [ "a:", ", b: " ]
 * @param str base string
 * @param openingOrSeparator opening character OR separator if closing not set
 * @param closing
 * @param ignoreBetweenOpen default ['\'', '`', '"', '/'], when reaching an opening char, it will ignore all until it find the corresponding closing char
 * @param ignoreBetweenClose default ['\'', '`', '"', '/'] list of corresponding closing chars
 */
export function getValuesBetweenStrings(str: string, openingOrSeparator, closing, ignoreBetweenOpen = ['\'', '`', '"', '/'], ignoreBetweenClose = ['\'', '`', '"', '/'], removeTrailingSpaces = true) {
    err500IfEmptyOrNotSet({ openingOrSeparator, str })

    str = str.replace(/<</g, '§§"').replace(/>>/g, '"§§')

    const arrayValues: string[] = []
    const betweenArray: string[] = []
    let level = 0
    let ignoreUntil: boolean | string = false
    let actualValue = ''
    let precedingChar = ''

    let separatorMode = false
    if (!closing) separatorMode = true

    const separator = separatorMode ? openingOrSeparator : false
    const openingChars = separatorMode ? ['(', '{', '['] : [openingOrSeparator]
    const closingChars = separatorMode ? [')', '}', ']'] : [closing]

    const pushActualValue = () => {
        if (level === 0) betweenArray.push(removeTrailingSpaces ? actualValue.replace(/(?:^\s+|\s+$)/g, '') : actualValue)
        else arrayValues.push(removeTrailingSpaces ? actualValue.replace(/(?:^\s+|\s+$)/g, '') : actualValue)
        actualValue = ''
    }

    str.split('').forEach(char => {
        // handle unwanted nested structure like characters in a strings that may be a unmatched closing / opening character
        // Eg: {'azer}aze'}
        if (ignoreUntil && char === ignoreUntil && precedingChar !== '\\') ignoreUntil = false
        else if (ignoreUntil && char !== ignoreUntil) true
        else if (ignoreBetweenOpen.includes(char)) {
            const indexChar = ignoreBetweenOpen.findIndex(char2 => char2 === char)
            ignoreUntil = ignoreBetweenClose[indexChar]
        } else if (openingChars.includes(char)) {
            // handle nested structures
            if (!separatorMode && level === 0) pushActualValue()
            level++
            if (!separatorMode) return
        } else if (closingChars.includes(char)) {
            // handle nested structures
            if (!separatorMode && level === 1) pushActualValue()
            level--
        } else if (separatorMode && level === 0 && char === separator) {
            // SEPARATOR MODE
            pushActualValue()
            return
        }
        actualValue += char
        precedingChar = char
    })

    pushActualValue()

    const replaceValz = arr => arr.map(v => v.replace(/§§"/g, '<<').replace(/"§§/g, '>>')).filter(v => v)

    return { inner: replaceValz(arrayValues), outer: replaceValz(betweenArray) }
}

/** Remove accentued character from string and eventually special chars and numbers
 * @param {String} str input string
 * @param {Object} config { removeSpecialChars: false, removeNumbers: false, removeSpaces: false }
 * @returns String with all accentued char replaced by their non accentued version + config formattting
 */
export function convertAccentedCharacters(str : string, config: { removeNumbers?: boolean, removeSpecialChars?: boolean, removeSpaces?: boolean } = {}) {
    let output = str
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[ÀÁÂÃÄÅ]/g, 'A')
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ÈÉÊË]/g, 'E')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[ÌÍÎÏ]/g, 'I')
        .replace(/[ôö]/g, 'o')
        .replace(/[ÔÖ]/g, 'O')
        .replace(/[ùúû]/g, 'u')
        .replace(/[ÙÚÛ]/g, 'U')
    if (config.removeNumbers === true) output = output.replace(/\d+/g, '');
    if (config.removeSpecialChars === true) output = output.replace(/[^A-Za-z0-9 ]/g, '');
    if (config.removeSpaces === true) output = output.replace(/\s+/g, '');
    return output;
}


let generatedTokens: string[] = [] // cache to avoid collision
let lastTs = new Date().getTime()
/** minLength 8 if unique 
* @param {Number} length default: 20
* @param {Boolean} unique default: true. Generate a real unique token base on the date. min length will be min 8 in this case
* @param {string} mode one of ['alphanumeric', 'hexadecimal']
* NOTE: to generate a mongoDB Random Id, use the params: 24, true, 'hexadecimal'
*/
export function generateToken(length = 20, unique = true, mode: 'alphanumeric' | 'hexadecimal' = 'alphanumeric') {
    let charConvNumeric = mode === 'alphanumeric' ? 36 : 16
    if (unique && length < 8) length = 8
    let token
    let tokenTs
    do {
        tokenTs = (new Date()).getTime()
        token = unique ? tokenTs.toString(charConvNumeric) : ''
        while (token.length < length) token += Math.random().toString(charConvNumeric).substr(2, 1) // char alphaNumeric aléatoire
    } while (generatedTokens.includes(token))
    if (lastTs < tokenTs) generatedTokens = [] // reset generated token on new timestamp because cannot collide
    generatedTokens.push(token)
    return token
}

export function generateObjectId() {
    return generateToken(24, true, 'hexadecimal')
}


/** Useful to join differents bits of url with normalizing slashes
 * * urlPathJoin('https://', 'www.kikou.lol/', '/user', '//2//') => https://www.kikou.lol/user/2
 * * urlPathJoin('http:/', 'kikou.lol') => https://www.kikou.lol
 */
export function urlPathJoin(...bits: string[]) {
    return bits
        .join('/')
        .replace(/\/+/g, '/') // replace double slash
        .replace(/(^\/|\/$)/g, '') // remove starting and trailing slash
        .replace(/(https?:)\/\/?/, '$1//') // make sure there is 2 slashes after http(s)
}

/** @deprecated use urlPathJoin instead // file path using ONLY SLASH and not antislash on windows. Remove also starting and trailing slashes */
export function pathJoinSafe(...pathBits: string[]) {
    return pathBits
        .join('/')
        .replace(/\/+/g, '/') // replace double slash
        .replace(/(^\/|\/$)/g, '') // remove starting and trailing slash
}


export type MiniTemplaterOptions = {
    valueWhenNotSet: string
    regexp: RegExp
    valueWhenContentUndefined: string
}
/** Replace variables in a string like: `Hello {{userName}}!`
 * @param {String} content 
 * @param {Object} varz object with key => value === toReplace => replacer
 * @param {Object} options 
 * * valueWhenNotSet => replacer for undefined values. Default: ''
 * * regexp          => must be 'g' and first capturing group matching the value to replace. Default: /{{\s*([^}]*)\s*}}/g
 */
export function miniTemplater(content: string, varz: ObjectGeneric, options: Partial<MiniTemplaterOptions> = {}): string {
    const options2:MiniTemplaterOptions = {
        valueWhenNotSet: '',
        regexp: /{{\s*([^}]*)\s*}}/g,
        valueWhenContentUndefined: '',
        ...options,
    }
    return isset(content) ? content.replace(options2.regexp, (m, $1) => isset(varz[$1]) ? varz[$1] : options2.valueWhenNotSet) : options2.valueWhenContentUndefined
}


/** Clean output for outside world. All undefined / null / NaN / Infinity values are changed to '-' */
export function cln(val, replacerInCaseItIsUndefinNaN = '-') { return ['undefined', undefined, 'indéfini', 'NaN', NaN, Infinity, null].includes(val) ? replacerInCaseItIsUndefinNaN : val }

export function nbOccurenceInString(baseString: string, searchedString:string, allowOverlapping: boolean = false) {

    if (searchedString.length === 0) return baseString.length + 1

    let n = 0
    let pos = 0
    let step = allowOverlapping ? 1 : searchedString.length

    while (true) {
        pos = baseString.indexOf(searchedString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}
