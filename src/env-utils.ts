//----------------------------------------
// ENV UTILS
//----------------------------------------

/** Parse one dimention object undefined, true, false, null represented as string will be converted to primitives */
export function parseEnv(env) {
    const newEnv = {}
    for (const k in env) {
        const val = env[k]
        if (val === 'undefined') newEnv[k] = undefined
        else if (val === 'true') newEnv[k] = true
        else if (val === 'false') newEnv[k] = false
        else if (val === 'null') newEnv[k] = null
        else newEnv[k] = env[k]
    }
    return newEnv
}

/** READ ONLY, output a parsed version of process.env
 * use it like ENV().myVar
 */
export function ENV(): { [key: string]: any } {
    const throwErr = () => { throw new Error('Please use process.env to write to env') }
    return new Proxy(parseEnv(process.env), {
        set: throwErr,
        defineProperty: throwErr,
        deleteProperty: throwErr,
    })
}