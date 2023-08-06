export * from './src/array-utils'
export * from './src/date-utils'
export * from './src/env-utils'
export * from './src/error-utils'
export * from './src/isset'
export * from './src/logger-utils'
export * from './src/loop-utils'
export * from './src/math-utils'
export * from './src/mongo-utils'
export * from './src/object-utils'
export * from './src/string-utils'
export * from './src/wtf-utils'
export * from './src/validation-utils'
export * from './src/transaction-utils'
export * from './src/timer-utils'
export * from './src/is-empty'
export * from './src/remove-circular-json-stringify'
export * from './src/is-object'
export * from './src/regexp-utils'
export * from './src/clean-stack-trace'
export { registerConfig } from './src/config'

import { moyenne } from './src/math-utils'
import { kebabCase, snakeCase } from './src/string-utils'
import { shuffleArray, noDuplicateFilter } from './src/array-utils'
import { issetOr, validator } from './src/validation-utils'
import { objFilterUndefinedRecursive } from './src/object-utils'
import { removeCircularJSONstringify } from './src/remove-circular-json-stringify'
import { escapeRegexp } from './src/regexp-utils'

// ALIASES mainly used for readability
export const int = (n: string | number) => typeof n === 'number' ? n : parseInt(n)
export const average = moyenne
export const arrayUniqueValue = noDuplicateFilter
export const JSONstringyParse = o => JSON.parse(removeCircularJSONstringify(o))
export const removeUndefinedKeys = objFilterUndefinedRecursive
export const randomizeArray = shuffleArray
export const dashCase = kebabCase
export const underscoreCase = snakeCase
export const required = validator
export const orIsset = issetOr
export const parseRegexp = escapeRegexp