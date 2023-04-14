import { Color, ErrorOptions } from './types'
import { isset } from './isset'
import { isNodeJs } from './is-nodejs'

const isNode = isNodeJs()

export type TopkatUtilConfig = {
    env: string
    isProd: boolean
    nbOfLogsToKeep: number
    customTypes: object,
    preprocessLog?: (log: string) => any,
    onError?: (msg: string, extraInfos: ErrorOptions) => any
    terminal: {
        noColor: boolean
        theme: {
            primary: Color, // blue theme
            shade1: Color,
            shade2: Color,
            bgColor?: Color
            paddingX: number
            paddingY: number
            fontColor?: Color
            pageWidth: number
            debugModeColor?: Color,
        }
    }
}

let config: TopkatUtilConfig = {
    // Also used as default config
    env: 'development',
    isProd: false,
    nbOfLogsToKeep: 25,
    customTypes: {},
    terminal: {
        noColor: !isNode,
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

export function registerConfig(customConfig: Partial<TopkatUtilConfig>) {
    if ('terminal' in customConfig === false) customConfig.terminal = {} as TopkatUtilConfig['terminal']
    const newconfig = {
        ...config,
        ...customConfig
    }
    newconfig.terminal = {
        ...config?.terminal,
        ...(customConfig?.terminal as any)
    }
    newconfig.terminal.theme = {
        ...config?.terminal?.theme,
        ...(customConfig?.terminal?.theme || {})
    }
    config = newconfig

    config.isProd = config?.env?.includes('prod') // preprod | production
}