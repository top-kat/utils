


const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_$'
const getCharAt = (n: number) => {
    if (n >= possibleChars.length) return possibleChars[n - possibleChars.length]
    if (n < 0) return possibleChars[n + possibleChars.length]
    else return possibleChars[n]
}
const getCharIndex = (char: string) => {
    return possibleChars.indexOf(char)
}


/** simple and quick encoding, this is meant to obfuscate JWT encoding so we can
not decode it with something like https://jwt.io/
TODO put it in validationUtils
 */
function simpleEncryption(strR: string, secret: string, decode = false): string {

    const secretNb = secret.split('').map(char => char.charCodeAt(0) % 16 || -1)
    const secretLength = secretNb.length
    const str = decode ? strR : strR.replace(/\./g, '$')

    const parsed = str.split('').map((char, i) => {
        const charI = getCharIndex(char) // convert character to number
        const newIndex = charI + (secretNb[i % secretLength] * (decode ? -1 : 1)) // obfuscate
        return getCharAt(newIndex)
    }).join('')

    return decode ? parsed.replace(/\$/g, '.') : parsed
}

export function simpleEncryptionEncode(str: string, secret: string) {
    return simpleEncryption(str, secret, false)
}

export function simpleEncryptionDecode(str: string, secret: string) {
    return simpleEncryption(str, secret, true)
}