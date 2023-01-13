import { Color } from './types'
import { isset } from './isset'
import { isNodeJs } from './is-nodejs'

export type TopkatUtilConfig = Partial<{
    env: string
    isProd: boolean
    nbOfLogsToKeep: number
    customTypes: object,
    preprocessLog?: Function,
    terminal: Partial<{
        noColor: boolean
        theme: Partial<{
            primary: Color, // blue theme
            shade1: Color,
            shade2: Color,
            bgColor?: Color
            paddingX?: number
            paddingY?: number
            fontColor?: Color
            pageWidth?: number
            debugModeColor?: Color,
        }>
    }>
}>

let config: TopkatUtilConfig = {
    // Also used as default config
    env: 'development',
    isProd: false,
    nbOfLogsToKeep: 25,
    customTypes: {},
    terminal: {
        noColor: true,
        theme: {
            primary: [0, 149, 250], // blue theme
            shade1: [0, 90, 250],
            shade2: [0, 208, 245],
            paddingX: 2,
            paddingY: 2,
            pageWidth: 53,
            debugModeColor: [201, 27, 169],
        }
    },
}

/** Allow dynamic changing of config */
export function configFn(): TopkatUtilConfig { return config }


/** Register custom config
 * @param {object} customConfig { 'email': email => /.+@.+/.test(email), type2 : myTestFunction() }
 * * env: 'development',
 * * customTypes: {},
 * * terminal: {
 * *     noColor: false, // disable colored escape sequences like /mOO35...etc
 * *     theme: {
 * *         primary: [61, 167, 32], // main color (title font)
 * *         shade1: [127, 192, 39], // gradient shade 1
 * *         shade2: [194, 218, 47], // gradient shade 2
 * *         bgColor: false,         // background color
 * *         paddingX: 2,            // nb spaces added before an outputted str
 * *         paddingY: 2,            //
 * *         fontColor: false,       // default font color
 * *         pageWidth: 53,          // page size in character
 * *         debugModeColor: [147, 212, 6], // usually orange
 * *     }
 * * },
 */
export function registerConfig(customConfig: TopkatUtilConfig) {
    const isNode = isNodeJs()
    if (!isset(customConfig.terminal)) customConfig.terminal = {}
    if (isNode) config.terminal.noColor = false
    const newconfig = {
        ...config,
        ...customConfig
    }
    newconfig.terminal = {
        ...config.terminal,
        ...customConfig.terminal
    }
    newconfig.terminal.theme = {
        ...config.terminal.theme,
        ...(customConfig.terminal.theme || {})
    }
    config = newconfig

    config.isProd = config.env.includes('prod')
}