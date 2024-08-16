/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    // testPathIgnorePatterns: ['dist/**/*'],
    testTimeout: 9999,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // '^.+\\.js$': '../../node_modules/babel-jest',
    },
    testRegex: ['.*\\.spec\\.[jt]sx?$'],
}

export default config
