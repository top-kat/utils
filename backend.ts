

import { C } from './src/logger-utils'
import { exec } from 'child_process'


/**
 * @param {String} command cli command to execute
 * @param {Obect} config
 * * logOutputStream
 * * stringOrRegexpToSearchForConsideringDone => when the output contain this string or matches this regexp, process is considered done. Else it will wait for exit
 * * timeout => timeout before killing process in seconds
 * * execOptions => see nodeJs exec command
 * * keyCodeToSend => { a: 1000, b: 2000 } keyCode: afterNMs; Eg: key a will be triggered after N milliseconds
 * * errorHandle (log: log the error as an error) (throw: throw the error)
 * * streamConsoleOutput: output => { } callback for streaming output
 */
export async function execWaitForOutput(
    command: string,
    config = {} as Partial<{
        logOutputStream: boolean
        stringOrRegexpToSearchForConsideringDone: string
        nbSecondsBeforeKillingProcess: number
        keyCodeToSend: { [keyCode: string]: number },
        errorHandle: 'log' | 'error'
        streamConsoleOutput: (outputStr: string) => any,
        execOptions: {cwd?: string, [seeNodeJsDocOnExec: string]: any}
    }>
): Promise<string | undefined> {

    let outputStream = ''
    let execOptions

    const { nbSecondsBeforeKillingProcess = 20, streamConsoleOutput = () => true, errorHandle = 'throw', logOutputStream = true, stringOrRegexpToSearchForConsideringDone, keyCodeToSend = {} } = config

    try {
        return await new Promise((res, reject) => {
            const to = setTimeout(() => {
                C.error(`Exec timeout for ${command}`)
                reject(`Exec timeout for ${command}`)
            }, nbSecondsBeforeKillingProcess * 1000)
            const resolve = () => {
                clearTimeout(to)
                res(outputStream)
            }
            const process2 = exec(command, execOptions)
            const stdCallback = data => {
                if (logOutputStream) C.log(data)
                streamConsoleOutput(data)
                outputStream += data
                if (stringOrRegexpToSearchForConsideringDone) {
                    const regexp = typeof stringOrRegexpToSearchForConsideringDone === 'string' ? new RegExp(stringOrRegexpToSearchForConsideringDone) : stringOrRegexpToSearchForConsideringDone
                    if (regexp.test(data)) resolve()
                }
            }
            const exitCallback = exitCode => {
                if (exitCode === 0) resolve()
                else if (stringOrRegexpToSearchForConsideringDone || typeof exitCode === 'number' && exitCode !== 0) reject(exitCode)
                else resolve()
            }
            process2.stderr?.on('data', stdCallback)
            process2.stdout?.on('data', stdCallback)
            process2.on('exit', exitCallback)
            process2.on('close', exitCallback)
            for (const keyCode in keyCodeToSend) {
                setTimeout(() => {
                    process2.stdin?.write(keyCode)
                    if (logOutputStream) C.log('Sending charcode to stdin: ' + keyCode)
                }, keyCodeToSend[keyCode])
            }
        })
    } catch (error) {
        if (errorHandle === 'log') C.error(`Something went wrong using this command: ${command}\nPlease check this log:\n${outputStream}`)
        else throw `Something went wrong using this command: ${command}\nPlease check this log:\n${outputStream}`
    }
}