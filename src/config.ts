import { Color, ErrorOptions } from './types'
import { isNodeJs } from './is-nodejs'
import { mergeDeep } from './object-utils'

const isNode = isNodeJs()

type TerminalTheme = {
    primary: Color, // blue theme
    shade1: Color,
    shade2: Color,
    bgColor?: Color
    paddingX?: number
    paddingY?: number
    fontColor?: Color
    pageWidth?: number
    debugModeColor?: Color,
}

type TerminalConfig = {
    noColor: boolean
    theme: TerminalTheme
}
type TerminalConfigRequired = {
    noColor: boolean
    theme: Required<TerminalTheme>
}

export type TopkatUtilConfig = {
    env: string
    isProd: boolean
    nbOfLogsToKeep: number
    customTypes: object,
    preprocessLog?: (log: string) => any,
    onError?: (msg: string, extraInfos: ErrorOptions) => any
    terminal: TerminalConfig
}

let config = {
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
export function configFn(): Required<TopkatUtilConfig & { terminal: TerminalConfigRequired }> { return config as any }

export function registerConfig(customConfig: RecursivePartial<TopkatUtilConfig>) {

    if ('terminal' in customConfig === false) customConfig.terminal = {} as TopkatUtilConfig['terminal']

    if (customConfig.terminal?.theme?.primary) {
        const primary = customConfig.terminal.theme.primary
        customConfig.terminal.theme.shade1 ??= [primary[0] / 2.2, primary[1] / 2.2, primary[2] / 2.2]
        customConfig.terminal.theme.shade1 ??= primary
    }

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
    config = mergeDeep(config, customConfig)

    config.isProd = config?.env ? config.env.includes('prod') : true // preprod | production
}


type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P]
}