"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reassignForbidden = exports.readOnly = exports.objFilterUndefined = exports.findByAddressAll = exports.recursiveGenericFunctionSync = exports.recursiveGenericFunction = exports.unflattenObject = exports.flattenObject = exports.mergeDeep = exports.isObject = exports.has = exports.JSONstringyParse = exports.cloneObject = exports.deepClone = exports.arrayUniqueValue = exports.randomItemInArray = exports.isNotEmptyArray = exports.pushIfNotExist = exports.arrayToObjectSorted = exports.arrayCount = exports.noDuplicateFilter = exports.getNotInArrayA = exports.getArrayDiff = exports.getArrayInCommon = exports.compareArrays = exports.asArray = exports.strAsArray = exports.objForceWriteIfNotSet = exports.objForceWrite = exports.findByAddress = exports.configFn = exports.registerConfig = exports.parseBool = exports.ENV = exports.simpleObjectMaskOrSelect = exports.isBetween = exports.generateObjectId = exports.miniTemplater = exports.urlPathJoin = exports.sortUrlsByDeepnessInArrayOrObject = exports.sumArray = exports.average = exports.moyenne = exports.generateToken = exports.minMax = exports.int = exports.pad = exports.cln = exports.random = exports.round = void 0;
exports.isEmpty = exports.errXXXIfNotSet = exports.err500IfEmptyOrNotSet = exports.errIfEmptyOrNotSet = exports.err500IfNotSet = exports.errIfNotSet = exports.isEmptyOrNotSet = exports.issetOr = exports.isDateObject = exports.isType = exports.isValid = exports.restTestMini = exports.assert = exports.validatorReturnErrArray = exports.required = exports.validator = exports.escapeRegexp = exports.getValuesBetweenStrings = exports.getValuesBetweenSeparator = exports.allMatches = exports.firstMatch = exports.camelCaseToWords = exports.capitalize1st = exports.upperCase = exports.lowerCase = exports.pascalCase = exports.titleCase = exports.underscoreCase = exports.dashCase = exports.kebabCase = exports.snakeCase = exports.camelCase = exports.forIasync = exports.forI = exports.round2 = exports.randomizeArray = exports.shuffleArray = exports.cleanStackTrace = exports.isset = exports.removeCircularJSONstringify = exports.ensureIsArrayAndPush = exports.deleteByAddress = exports.filterKeys = exports.ensureObjectProp = exports.sortObjKeyAccordingToValue = exports.removeUndefinedKeys = exports.objFilterUndefinedRecursive = exports.mergeDeepConfigurable = exports.mergeDeepOverrideArrays = exports.readOnlyForAll = void 0;
exports.transaction = exports.waitUntilTrue = exports.runAsync = exports.timeout = exports.executeInDelayedLoop = exports.convertAccentedCharacters = exports.cliLoadingSpinner = exports.cliProgressBar = exports.C = exports.convertDateAsObject = exports.convertDateAsInt = exports.differenceInWeeks = exports.differenceInDays = exports.differenceInHours = exports.differenceInMinutes = exports.differenceInSeconds = exports.differenceInMilliseconds = exports.lastDayOfMonth = exports.firstDayOfMonth = exports.getMinutes = exports.getHours = exports.getDayOfMonth = exports.getYear = exports.addYears = exports.addMonths = exports.addDays = exports.addHours = exports.addMinutes = exports.nextWeekDay = exports.getMonthAsInt = exports.doDateOverlap = exports.getDuration = exports.isTimeStringValid = exports.getIntAsTime = exports.getTimeAsInt = exports.dateOffset = exports.dateFormatted = exports.dateSlash = exports.dateArrayInt = exports.dateArray = exports.dateStringToArray = exports.isDateIsoOrObjectValid = exports.isDateIntOrStringValid = exports.getDateAsObject = exports.getDateAsInt = exports.humanReadableTimestamp = exports.getDateAsInt12 = exports.orIsset = exports.checkCtxIntegrity = exports.checkAllObjectValuesAreEmpty = void 0;
exports.tryCatch = exports.mongoPush = exports.mongoFilterMerger = exports.mergeMixins = exports.getId = exports.waitForTransaction = void 0;
// ALIASES
const int = parseInt;
exports.int = int;
const average = moyenne;
exports.average = average;
const arrayUniqueValue = noDuplicateFilter;
exports.arrayUniqueValue = arrayUniqueValue;
const JSONstringyParse = o => JSON.parse(removeCircularJSONstringify(o));
exports.JSONstringyParse = JSONstringyParse;
const removeUndefinedKeys = objFilterUndefinedRecursive;
exports.removeUndefinedKeys = removeUndefinedKeys;
/** Round with custom number of decimals (default:0) */
function round(number, decimals = 0) { return Math.round((typeof number === 'number' ? number : parseFloat(number)) * Math.pow(10, decimals)) / Math.pow(10, decimals); }
exports.round = round;
/** Round with custom number of decimals (default:2) */
function round2(number, decimals = 2) { return round(number, decimals); }
exports.round2 = round2;
/** Is number between two numbers (including those numbers) */
function isBetween(number, min, max, inclusive = true) { return inclusive ? number <= max && number >= min : number < max && number > min; }
exports.isBetween = isBetween;
/** Random number between two values with 0 decimals by default */
function random(nb1, nb2, nbOfDecimals = 0) { return round(Math.random() * (nb2 - nb1) + nb1, nbOfDecimals); }
exports.random = random;
/** Sum all values of an array, all values MUST be numbers */
function sumArray(array) {
    return array.filter(item => typeof item === 'number').reduce((sum, val) => isset(val) ? val + sum : sum, 0);
}
exports.sumArray = sumArray;
/** Moyenne / average between array of values
 * @param {Number} round number of decimals to keep. Default:2
*/
function moyenne(array, nbOfDecimals = 2) {
    return round(sumArray(array) / array.length, nbOfDecimals);
}
exports.moyenne = moyenne;
/** Clean output for outside world. All undefined / null / NaN / Infinity values are changed to '-' */
function cln(val, replacerInCaseItIsUndefinNaN = '-') { return ['undefined', undefined, 'indéfini', 'NaN', NaN, Infinity, null].includes(val) ? replacerInCaseItIsUndefinNaN : val; }
exports.cln = cln;
/** length default 2, shortcut for 1 to 01 */
function pad(numberOrStr, length = 2) { return ('' + numberOrStr).padStart(length, '0'); }
exports.pad = pad;
/** return the number or the closest number of the range
 * * nb min max  => returns
 * * 7  5   10   => 7 // in the range
 * * 2  5   10   => 5 // below the min value
 * * 99 5   10   => 10// above the max value
 */
function minMax(nb, min, max) { return Math.max(min, Math.min(nb, max)); }
exports.minMax = minMax;
async function tryCatch(callback, onErr = () => { }) {
    try {
        return await callback();
    }
    catch (err) {
        return await onErr(err);
    }
}
exports.tryCatch = tryCatch;
let generatedTokens = []; // cache to avoid collision
let lastTs = new Date().getTime();
/** minLength 8 if unique
* @param {Number} length default: 20
* @param {Boolean} unique default: true. Generate a real unique token base on the date. min length will be min 8 in this case
* @param {string} mode one of ['alphanumeric', 'hexadecimal']
* NOTE: to generate a mongoDB Random Id, use the params: 24, true, 'hexadecimal'
*/
function generateToken(length = 20, unique = true, mode = 'alphanumeric') {
    let charConvNumeric = mode === 'alphanumeric' ? 36 : 16;
    if (unique && length < 8)
        length = 8;
    let token;
    let tokenTs;
    do {
        tokenTs = (new Date()).getTime();
        token = unique ? tokenTs.toString(charConvNumeric) : '';
        while (token.length < length)
            token += Math.random().toString(charConvNumeric).substr(2, 1); // char alphaNumeric aléatoire
    } while (generatedTokens.includes(token));
    if (lastTs < tokenTs)
        generatedTokens = []; // reset generated token on new timestamp because cannot collide
    generatedTokens.push(token);
    return token;
}
exports.generateToken = generateToken;
function generateObjectId() {
    return generateToken(24, true, 'hexadecimal');
}
exports.generateObjectId = generateObjectId;
/** Useful to join differents bits of url with normalizing slashes
 * * urlPathJoin('https://', 'www.kikou.lol/', '/user', '//2//') => https://www.kikou.lol/user/2/
 * * urlPathJoin('http:/', 'kikou.lol') => https://www.kikou.lol
 */
function urlPathJoin(...bits) {
    return bits.join('/').replace(/\/+/g, '/').replace(/(https?:)\/\/?/, '$1//');
}
exports.urlPathJoin = urlPathJoin;
/** path shall always be sorted before using in express
 *  to avoid a generic route like /* to catch a specific one like /bonjour
 *
 * @param {Object[]} urlObjOrArr
 * @param {String} propInObjectOrIndexInArray
 * @return {Array} urls modified
 */
function sortUrlsByDeepnessInArrayOrObject(urlObjOrArr, propInObjectOrIndexInArray) {
    // SORTING BY
    // Deepness => /user vs /user/contract
    // simply count the / occurence to sort deepest path first to avoid concurrence or routes mislead
    const deepness = route => (route.match(/\//g) || []).length;
    // AND params deepness
    // avoid `/user/:param` to take precedence over `/user/field` as `user/fields` will be catched by the first route
    // Eg: /user/:rr/name/:id => 14pts
    //     /user/:id/:name/id => 15pts take precedence
    const paramPrecedencePts = route => route.split('/').reduce((pts, routeChunk, i) => /^:/.test(routeChunk) ? pts + (10 - i) : pts, 0);
    return urlObjOrArr.sort((a, b) => {
        const aUrl = a[propInObjectOrIndexInArray] || a;
        const bUrl = b[propInObjectOrIndexInArray] || b;
        if (!aUrl)
            return -1;
        if (!bUrl)
            return 1;
        return deepness(bUrl) - deepness(aUrl) || // /a/b vs /a
            paramPrecedencePts(aUrl) - paramPrecedencePts(bUrl) || // /:dynamicparam vs /param
            bUrl.length - aUrl.length; // help separating / vs /blah
    });
}
exports.sortUrlsByDeepnessInArrayOrObject = sortUrlsByDeepnessInArrayOrObject;
/** Replace variables in a string like: `Hello {{userName}}!`
 * @param {String} content
 * @param {Object} varz object with key => value === toReplace => replacer
 * @param {Object} options
 * * valueWhenNotSet => replacer for undefined values. Default: ''
 * * regexp          => must be 'g' and first capturing group matching the value to replace. Default: /{{\s*([^}]*)\s*}}/g
 */
function miniTemplater(content, varz, options = {}) {
    options = {
        valueWhenNotSet: '',
        regexp: /{{\s*([^}]*)\s*}}/g,
        valueWhenContentUndefined: '',
        ...options,
    };
    return isset(content) ? content.replace(options.regexp, (m, $1) => isset(varz[$1]) ? varz[$1] : options.valueWhenNotSet) : options.valueWhenContentUndefined;
}
exports.miniTemplater = miniTemplater;
/**
 *
 * @param {Object} object main object
 * @param {String[]} maskedOrSelectedFields array of fields
 * @param {Boolean} isMask default: true; determine the behavior of the function. If is mask, selected fields will not appear in the resulting object. If it's a select, only selected fields will appear.
 * @param {Boolean} deleteKeysInsteadOfReturningAnewObject default:false; modify the existing object instead of creating a new instance
 */
function simpleObjectMaskOrSelect(object, maskedOrSelectedFields, isMask = true, deleteKeysInsteadOfReturningAnewObject = false) {
    const allKeys = Object.keys(object);
    const keysToMask = allKeys.filter(keyName => {
        if (isMask)
            return maskedOrSelectedFields.includes(keyName);
        else
            return !maskedOrSelectedFields.includes(keyName);
    });
    if (deleteKeysInsteadOfReturningAnewObject) {
        keysToMask.forEach(keyNameToDelete => delete object[keyNameToDelete]);
        return object;
    }
    else {
        return allKeys.reduce((newObject, key) => {
            if (!keysToMask.includes(key))
                newObject[key] = object[key];
            return newObject;
        }, {});
    }
}
exports.simpleObjectMaskOrSelect = simpleObjectMaskOrSelect;
/** Parse one dimention object undefined, true, false, null represented as string will be converted to primitives */
function parseEnv(env) {
    const newEnv = {};
    for (const k in env) {
        const val = env[k];
        if (val === 'undefined')
            newEnv[k] = undefined;
        else if (val === 'true')
            newEnv[k] = true;
        else if (val === 'false')
            newEnv[k] = false;
        else if (val === 'null')
            newEnv[k] = null;
        else
            newEnv[k] = env[k];
    }
    return newEnv;
}
/** READ ONLY, output a parsed version of process.env
 * use it like ENV().myVar
 */
function ENV() {
    const throwErr = () => { throw new Error('Please use process.env to write to env'); };
    return new Proxy(parseEnv(process.env), {
        set: throwErr,
        defineProperty: throwErr,
        deleteProperty: throwErr,
    });
}
exports.ENV = ENV;
/**
 * @param {any} mayBeAstring
 * @return !!value
 */
function parseBool(mayBeAstring) {
    if (typeof mayBeAstring === 'boolean')
        return mayBeAstring;
    else
        return mayBeAstring === 'true' ? true : mayBeAstring === 'false' ? false : !!mayBeAstring;
}
exports.parseBool = parseBool;
function dim(str = '') {
    return configFn().terminal.noColor ? str : `\x1b[2m${str.toString().split('\n').join('\x1b[0m\n\x1b[2m')}\x1b[0m`;
}
let config = {
    env: 'development',
    isProd: false,
    nbOfLogsToKeep: 25,
    customTypes: {},
    terminal: {
        noColor: false,
        theme: {
            primary: [0, 149, 250],
            shade1: [0, 90, 250],
            shade2: [0, 208, 245],
            paddingX: 2,
            paddingY: 2,
            pageWidth: 53,
            debugModeColor: [201, 27, 169],
        }
    },
};
/** Allow dynamic changing of config */
function configFn() { return config; }
exports.configFn = configFn;
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
function registerConfig(customConfig) {
    if (!isset(customConfig.terminal))
        customConfig.terminal = {};
    const newconfig = {
        ...config,
        ...customConfig
    };
    newconfig.terminal = {
        ...config.terminal,
        ...customConfig.terminal
    };
    newconfig.terminal.theme = {
        ...config.terminal.theme,
        ...(customConfig.terminal.theme || {})
    };
    config = newconfig;
    config.isProd = config.env.includes('prod');
}
exports.registerConfig = registerConfig;
//----------------------------------------
// ERROR HANDLER
//----------------------------------------
class dataValidationUtilErrorHandler extends Error {
    constructor(msg, code, extraInfos) {
        super(msg);
        this.message = msg;
        this.msg = msg;
        this.name = `${code} ${msg}`;
        this.fromDataValidation = true; // will be catched by express error handler
        this.code = code;
        this.extraInfos = extraInfos;
        this.errorDescription = {
            msg,
            code,
            ...extraInfos,
        };
    }
}
//----------------------------------------
// Object utils shared
//----------------------------------------
/**
 * check if **object OR array** has property Safely (avoid cannot read property x of null and such)
 * @param {Object} obj object to test against
 * @param {string} addr `a.b.c.0.1` will test if myObject has props a that has prop b. Work wit arrays as well (like `arr.0`)
 */
function has(obj, addr) {
    if (!isset(obj) || typeof obj !== 'object')
        return;
    let propsArr = addr.replace(/\.?\[(\d+)\]/g, '.$1').split('.'); // replace a[3] => a.3;
    let objChain = obj;
    return propsArr.every(prop => {
        objChain = objChain[prop];
        return isset(objChain);
    });
}
exports.has = has;
/** Find address in an object "a.b.c" IN { a : { b : {c : 'blah' }}} RETURNS 'blah'
 * @param {object} obj
 * @param {string} addr accept syntax like "obj.subItem.[0].sub2" OR "obj.subItem.0.sub2" OR "obj.subItem[0].sub2"
 * @returns {any} the last item of the chain OR undefined if not found
 */
function findByAddress(obj, addr) {
    if (addr === '')
        return obj;
    if (!isset(obj) || typeof obj !== 'object')
        return console.warn('Main object in `findByAddress` function is undefined or has the wrong type');
    const propsArr = addr.replace(/\.?\[(\d+)\]/g, '.$1').split('.'); // replace .[4] AND [4] TO .4
    const objRef = propsArr.reduce((objChain, prop) => {
        if (!isset(objChain) || typeof objChain !== 'object' || !isset(objChain[prop]))
            return;
        else
            return objChain[prop];
    }, obj);
    return objRef;
}
exports.findByAddress = findByAddress;
/** Enforce writing subItems. Eg: user.name.blah will ensure all are set until the writing of the last item
 * NOTE: doesn't work with arrays
 */
function objForceWrite(obj, addr, item) {
    const chunks = addr.replace(/\.?\[(\d+)\]/g, '.[$1').split('.');
    let lastItem = obj;
    chunks.forEach((chunkRaw, i) => {
        const chunk = chunkRaw.replace(/^\[/, '');
        if (i === chunks.length - 1)
            lastItem[chunk] = item;
        else if (!isset(lastItem[chunk])) {
            const nextChunk = chunks[i + 1];
            if (isset(nextChunk) && nextChunk.startsWith('['))
                lastItem[chunk] = [];
            else
                lastItem[chunk] = {};
        }
        else if (typeof lastItem[chunk] !== 'object')
            throw new dataValidationUtilErrorHandler(`itemNotTypeObjectOrArrayInAddrChainForObjForceWrite`, 500, { origin: 'Validator', chunks, actualValueOfItem: lastItem[chunk], actualChunk: chunk });
        lastItem = lastItem[chunk];
    });
}
exports.objForceWrite = objForceWrite;
/** Enforce writing subItems, only if obj.addr is empty.
 * Eg: user.name.blah will ensure all are set until the writing of the last item
 * if user.name.blah has a value it will not change it.
 * NOTE: doesn't work with arrays
 */
function objForceWriteIfNotSet(obj, addr, item) {
    if (!isset(findByAddress(obj, addr)))
        return objForceWrite(obj, addr, item);
}
exports.objForceWriteIfNotSet = objForceWriteIfNotSet;
/** Merge mixins into class. Use it in the constructor like: mergeMixins(this, {myMixin: true}) */
function mergeMixins(that, ...mixins) {
    mixins.forEach(mixin => {
        for (const method in mixin) {
            that[method] = mixin[method];
        }
    });
}
exports.mergeMixins = mergeMixins;
/** If a string is provided, return it as array else return the value */
function strAsArray(arrOrStr) {
    return typeof arrOrStr === 'string' ? [arrOrStr] : arrOrStr;
}
exports.strAsArray = strAsArray;
/** If not an array provided, return the array with the value
 * /!\ NOTE /!\ In case the value is null or undefined, it will return that value
 */
function asArray(item) {
    return (typeof item === 'undefined' ? item : Array.isArray(item) ? item : [item]);
}
exports.asArray = asArray;
/** Array comparison
 * @return {object} { inCommon, notInB, notInA }
 */
function compareArrays(arrayA, arrayB, compare = (a, b) => a === b) {
    return {
        inCommon: getArrayInCommon(arrayA, arrayB, compare),
        notInB: getNotInArrayA(arrayB, arrayA, compare),
        notInA: getNotInArrayA(arrayA, arrayB, compare),
    };
}
exports.compareArrays = compareArrays;
/**
 * @return [] only elements that are both in arrayA and arrayB
 */
function getArrayInCommon(arrayA = [], arrayB = [], compare = (a, b) => a === b) {
    if (!Array.isArray(arrayA) || !Array.isArray(arrayB))
        return [];
    else
        return arrayA.filter(a => arrayB.some(b => compare(a, b)));
}
exports.getArrayInCommon = getArrayInCommon;
/**
 * @return [] only elements that are in arrayB and not in arrayA
 */
function getNotInArrayA(arrayA = [], arrayB = [], compare = (a, b) => a === b) {
    if (!Array.isArray(arrayA) && Array.isArray(arrayB))
        return arrayB;
    else if (!Array.isArray(arrayB))
        return [];
    else
        return arrayB.filter(b => !arrayA.some(a => compare(a, b)));
}
exports.getNotInArrayA = getNotInArrayA;
/**
 * @return [] only elements that are in neither arrayA and arrayB
 */
function getArrayDiff(arrayA = [], arrayB = [], compare = (a, b) => a === b) {
    return [...getNotInArrayA(arrayA, arrayB, compare), ...getNotInArrayA(arrayB, arrayA, compare)];
}
exports.getArrayDiff = getArrayDiff;
/** filter duplicate values in an array
 * @param {function} comparisonFn default:(a, b) => a === b. A function that shall return true if two values are considered equal
 * @return {array|function}
 */
function noDuplicateFilter(arr, comparisonFn = (a, b) => a === b) {
    return arr.filter((a, i, arr) => arr.findIndex(b => comparisonFn(a, b)) === i);
}
exports.noDuplicateFilter = noDuplicateFilter;
/** Count number of occurence of item in array */
function arrayCount(item, arr) {
    return arr.reduce((total, item2) => item === item2 ? total + 1 : total, 0);
}
exports.arrayCount = arrayCount;
/**
 * Sort an array in an object of subArrays, no duplicate.
 * @param {Array} array
 * @param {function} getFieldFromItem (itemOfArray) => field[String|Number]
 * tell me how you want to sort your Array
 */
function arrayToObjectSorted(array, getFieldFromItem) {
    const res = {};
    array.forEach(item => {
        objForceWriteIfNotSet(res, getFieldFromItem(item), []);
        res[getFieldFromItem(item)].push(item);
    });
    return res;
}
exports.arrayToObjectSorted = arrayToObjectSorted;
/**
 * @param {Function} comparisonFunction default: (itemToPush, itemAlreadyInArray) => itemToPush === itemAlreadyInArray; comparison function to consider the added item duplicate
 */
function pushIfNotExist(arrayToPushInto, valueOrArrayOfValuesToBePushed, comparisonFunction = (a, b) => a === b) {
    const valuesToPush = asArray(valueOrArrayOfValuesToBePushed).filter(a => !arrayToPushInto.some(b => comparisonFunction(a, b)));
    arrayToPushInto.push(...valuesToPush);
    return arrayToPushInto;
}
exports.pushIfNotExist = pushIfNotExist;
function isNotEmptyArray(arr) {
    return Array.isArray(arr) && !!arr.length;
}
exports.isNotEmptyArray = isNotEmptyArray;
function randomItemInArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomItemInArray = randomItemInArray;
function cloneObject(o) {
    return JSON.parse(JSON.stringify(o));
}
exports.cloneObject = cloneObject;
/** Deep clone. WILL REMOVE circular references */
function deepClone(obj, cache = []) {
    let copy;
    // usefull to not modify 1st level objet by lower levels
    // this is required for the same object to be referenced not in a redundant way
    const newCache = [...cache];
    if (obj instanceof Date)
        return new Date(obj);
    // Handle Array
    if (Array.isArray(obj)) {
        if (newCache.includes(obj))
            return [];
        newCache.push(obj);
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i], newCache);
        }
        return copy;
    }
    if (typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype) {
        if (newCache.includes(obj))
            return {};
        newCache.push(obj);
        copy = {};
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key], newCache);
            }
        }
        return copy;
    }
    return obj; // number, string...
}
exports.deepClone = deepClone;
/** test if object but not array and not null (null is an object in Js) */
function isObject(o) { return o instanceof Object && [Object, Error].includes(o.constructor); }
exports.isObject = isObject;
/** object and array merge
 * @warn /!\ Array will be merged and duplicate values will be deleted /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified*/
function mergeDeep(...objects) {
    return mergeDeepConfigurable((previousVal, currentVal) => [...previousVal, ...currentVal].filter((elm, i, arr) => arr.indexOf(elm) === i), (previousVal, currentVal) => mergeDeep(previousVal, currentVal), undefined, ...objects);
}
exports.mergeDeep = mergeDeep;
/** object and array merge
 * @warn /!\ Array will be replaced by the latest object /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified */
function mergeDeepOverrideArrays(...objects) {
    return mergeDeepConfigurable(undefined, (previousVal, currentVal) => mergeDeepOverrideArrays(previousVal, currentVal), undefined, ...objects);
}
exports.mergeDeepOverrideArrays = mergeDeepOverrideArrays;
/** object and array merge
 * @param {Function} replacerForArrays item[key] = (prevValue, currentVal) => () When 2 values are arrays,
 * @param {Function} replacerForObjects item[key] = (prevValue, currentVal) => () When 2 values are objects,
 * @param {Function} replacerDefault item[key] = (prevValue, currentVal) => () For all other values
 * @param  {...Object} objects
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified
 */
function mergeDeepConfigurable(replacerForArrays = (prev, curr) => curr, replacerForObjects, replacerDefault = (prev, curr) => curr, ...objects) {
    return objects.reduce((actuallyMerged, obj) => {
        Object.keys(obj).forEach(key => {
            const previousVal = actuallyMerged[key];
            const currentVal = obj[key];
            if (Array.isArray(previousVal) && Array.isArray(currentVal)) {
                actuallyMerged[key] = replacerForArrays(previousVal, currentVal);
            }
            else if (isObject(previousVal) && isObject(currentVal)) {
                actuallyMerged[key] = replacerForObjects(previousVal, currentVal);
            }
            else {
                actuallyMerged[key] = replacerDefault(previousVal, currentVal);
            }
        });
        return actuallyMerged;
    }, {});
}
exports.mergeDeepConfigurable = mergeDeepConfigurable;
/** { a: {b:2}} => {'a.b':2} useful for translations
 * NOTE: will remove circular references
 */
function flattenObject(data, config = {}) {
    const { withoutArraySyntax = false, withArraySyntaxMinified = false } = config;
    const result = {};
    const seenObjects = []; // avoidCircular reference to infinite loop
    const recurse = (cur, prop) => {
        if (Array.isArray(cur)) {
            let l = cur.length;
            let i = 0;
            if (withoutArraySyntax)
                recurse(cur[0], prop);
            else {
                for (; i < l; i++)
                    recurse(cur[i], prop + (withArraySyntaxMinified ? `.${i}` : `[${i}]`));
                if (l == 0)
                    result[prop] = [];
            }
        }
        else if (isObject(cur)) { // is object
            try {
                if (seenObjects.includes(cur))
                    cur = deepClone(cur); // avoid circular ref but allow duplicate objects
                else
                    seenObjects.push(cur);
                const isEmpty = Object.keys(cur).length === 0;
                for (const p in cur)
                    recurse(cur[p], (prop ? prop + '.' : '') + p.replace(/\./g, '%')); // allow prop to contain special chars like points);
                if (isEmpty && prop)
                    result[prop] = {};
            }
            catch (error) {
                C.warning('Circular reference in flattenObject, impossible to parse');
            }
        }
        else
            result[prop] = cur;
    };
    recurse(data, '');
    return result;
}
exports.flattenObject = flattenObject;
/** {'a.b':2} => { a: {b:2}} */
function unflattenObject(data) {
    const newO = {};
    for (const [addr, value] of Object.entries(data))
        objForceWrite(newO, addr, value);
    return newO;
}
exports.unflattenObject = unflattenObject;
/**
 * @param {any} item the first array or object or whatever you want to recursively browse
 * @param {function} callback the callback you want to apply on items including the main one
 *   * this callback has 2 arguments: (item, address) =>
 *   * `item` => the actual item
 *   * `addr` => the address of the item, not including root (Eg: subItem1.sub2.[3].[2]) array indexes are juste written as numbers
 *   * `lastElementKey` => the key of last item. May be a number if last item is an array
 *   * `parent` => reference the parent object as this is the only way of reassigning a value for the item. Eg: parent[lastElementKey] = myNewItem
 *   * **NOTE** => if a key of an item contains dots, they will be replaced by '%' in `addr`
 *   * **NOTE2** => if false is returned by the callback it will stop all other iterations (but not in an array)
 * @param {string} addr$ optional, the base address for the callback function
 * @param lastElementKey technical field
 * NOTE: will remove circular references
 * /!\ check return values
 */
async function recursiveGenericFunction(item, callback, addr$ = '', lastElementKey = '', parent, techFieldToAvoidCircularDependency = []) {
    err500IfNotSet({ callback });
    if (!techFieldToAvoidCircularDependency.includes(item)) {
        const result = addr$ === '' ? true : await callback(item, addr$, lastElementKey, parent);
        if (result !== false) {
            const addr = addr$ ? addr$ + '.' : '';
            if (isType(item, 'array')) {
                techFieldToAvoidCircularDependency.push(item);
                await Promise.all(item.map((e, i) => recursiveGenericFunction(e, callback, addr + '[' + i + ']', i, item, techFieldToAvoidCircularDependency)));
            }
            else if (isObject(item)) {
                techFieldToAvoidCircularDependency.push(item);
                await Promise.all(Object.entries(item).map(([key, val]) => recursiveGenericFunction(val, callback, addr + key.replace(/\./g, '%'), key, item, techFieldToAvoidCircularDependency)));
            }
        }
    }
    return item;
}
exports.recursiveGenericFunction = recursiveGenericFunction;
/**
 * @param {any} item the first array or object or whatever you want to recursively browse
 * @param {function} callback the callback you want to apply on items including the main one
 *   * this callback has 2 arguments: (item, address) =>
 *   * `item` => the actual item
 *   * `addr` => the address of the item, not including root (Eg: subItem1.sub2.[3].[2]) array indexes are juste written as numbers
 *   * `lastElementKey` => the key of last item. May be a number if last item is an array
 *   * `parent` => reference the parent object as this is the only way of reassigning a value for the item. Eg: parent[lastElementKey] = myNewItem
 *   * **NOTE** => if a key of an item contains dots, they will be replaced by '%' in `addr`
 *   * **NOTE2** => if false is returned by the callback it will stop all other iterations (but not in an array)
 *   * **NOTE3** => to reassign a key use =>  parent[lastElementKey] = myNewItem
 * @param {string} addr$ optional, the base address for the callback function
 * @param lastElementKey technical field
 * NOTE: will remove circular references
 * /!\ check return values
 */
function recursiveGenericFunctionSync(item, callback, addr$ = '', lastElementKey = '', parent, techFieldToAvoidCircularDependency = []) {
    err500IfNotSet({ callback });
    if (!techFieldToAvoidCircularDependency.includes(item)) {
        const result = addr$ === '' ? true : callback(item, addr$, lastElementKey, parent);
        if (result !== false) {
            const addr = addr$ ? addr$ + '.' : '';
            if (isType(item, 'array')) {
                techFieldToAvoidCircularDependency.push(item); // do not up one level
                item.forEach((e, i) => recursiveGenericFunctionSync(e, callback, addr + '[' + i + ']', i, item, techFieldToAvoidCircularDependency));
            }
            else if (isObject(item)) {
                techFieldToAvoidCircularDependency.push(item);
                Object.entries(item).forEach(([key, val]) => recursiveGenericFunctionSync(val, callback, addr + key.replace(/\./g, '%'), key, item, techFieldToAvoidCircularDependency));
            }
        }
    }
    return item;
}
exports.recursiveGenericFunctionSync = recursiveGenericFunctionSync;
/** Remove all key/values pair if value is undefined  */
function objFilterUndefined(o) {
    Object.keys(o).forEach(k => !isset(o[k]) && delete o[k]);
    return o;
}
exports.objFilterUndefined = objFilterUndefined;
/** Lock all 1st level props of an object to read only */
function readOnly(o) {
    const throwErr = () => { throw new dataValidationUtilErrorHandler('Cannot modify object that is read only', 500); };
    return new Proxy(o, {
        set: throwErr,
        defineProperty: throwErr,
        deleteProperty: throwErr,
    });
}
exports.readOnly = readOnly;
/** Fields of the object can be created BUT NOT reassignated */
function reassignForbidden(o) {
    return new Proxy(o, {
        defineProperty: function (that, key, value) {
            if (key in that)
                throw new dataValidationUtilErrorHandler(`Cannot reassign the property ${key.toString()} of this object`, 500);
            else {
                that[key] = value;
                return true;
            }
        },
        deleteProperty: function (_, key) {
            throw new dataValidationUtilErrorHandler(`Cannot delete the property ${key.toString()} of this object`, 500);
        }
    });
}
exports.reassignForbidden = reassignForbidden;
/** All fileds and subFields of the object will become readOnly */
function readOnlyForAll(object) {
    recursiveGenericFunctionSync(object, (item, _, lastElementKey, parent) => {
        if (typeof item === 'object')
            parent[lastElementKey] = readOnly(item);
    });
    return object;
}
exports.readOnlyForAll = readOnlyForAll;
function objFilterUndefinedRecursive(obj) {
    if (obj) {
        const flattenedObj = flattenObject(obj);
        Object.keys(flattenedObj).forEach(key => {
            if (!isset(flattenedObj[key])) {
                delete flattenedObj[key];
            }
        });
        return unflattenObject(flattenedObj);
    }
    else
        return obj;
}
exports.objFilterUndefinedRecursive = objFilterUndefinedRecursive;
/** Will return all objects matching that path. Eg: user.*.myVar */
function findByAddressAll(obj, addr) {
    err500IfNotSet({ obj, addr });
    if (addr === '')
        return obj;
    const addrRegexp = new RegExp('^' + addr
        .replace(/\.?\[(\d+)\]/g, '.$1') // replace .[4] AND [4] TO .4
        .replace(/\./g, '\\.')
        .replace(/\.\*/g, '.[^.[]+') // replace * by [^. (all but a point or a bracket)]
        + '$');
    const matchingItems = [];
    recursiveGenericFunctionSync(obj, (item, address) => {
        if (addrRegexp.test(address))
            matchingItems.push(item);
    });
    return matchingItems;
}
exports.findByAddressAll = findByAddressAll;
function sortObjKeyAccordingToValue(unorderedObj, ascending = true) {
    const orderedObj = {};
    const sortingConst = ascending ? 1 : -1;
    Object.keys(unorderedObj)
        .sort((keyA, keyB) => unorderedObj[keyA] < unorderedObj[keyB] ? sortingConst : -sortingConst)
        .forEach(key => { orderedObj[key] = unorderedObj[key]; });
    return orderedObj;
}
exports.sortObjKeyAccordingToValue = sortObjKeyAccordingToValue;
/**
 * Make default value if object key do not exist
 * @param {object} obj
 * @param {string} addr
 * @param {any} defaultValue
 * @param {function} callback (obj[addr]) => processValue. Eg: myObjAddr => myObjAddr.push('bikou')
 * @return obj[addr] eventually processed by the callback
 */
function ensureObjectProp(obj, addr, defaultValue, callback = o => o) {
    err500IfNotSet({ obj, addr, defaultValue, callback });
    if (!isset(obj[addr]))
        obj[addr] = defaultValue;
    callback(obj[addr]);
    return obj[addr];
}
exports.ensureObjectProp = ensureObjectProp;
/**
 * Maye sure obj[addr] is an array and push a value to it
 * @param {Object} obj parent object
 * @param {String} addr field name in parent
 * @param {Any} valToPush
 * @param {Boolean} onlyUniqueValues default:false; may be true or a comparision function; (a,b) => return true if they are the same like (a, b) => a.name === b.name
 * @return obj[addr] eventually processed by the callback
 */
function ensureIsArrayAndPush(obj, addr, valToPush, onlyUniqueValues) {
    return ensureObjectProp(obj, addr, [], objValue => {
        if (isset(onlyUniqueValues)) {
            let duplicateFound = false;
            if (typeof onlyUniqueValues === 'function')
                duplicateFound = objValue.some(a => onlyUniqueValues(a, valToPush));
            else
                duplicateFound = objValue.includes(valToPush);
            if (!duplicateFound)
                objValue.push(valToPush);
        }
        else
            objValue.push(valToPush);
    });
}
exports.ensureIsArrayAndPush = ensureIsArrayAndPush;
/**
 * @param {Object} obj the object on which we want to filter the keys
 * @param {function} filterFunc function that returns true if the key match the wanted criteria
 */
function filterKeys(obj, filter) {
    const clone = cloneObject(obj);
    recursiveGenericFunctionSync(obj, (item, addr, lastElementKey) => {
        if (!filter(lastElementKey))
            deleteByAddress(clone, addr.split('.'));
    });
    return clone;
}
exports.filterKeys = filterKeys;
/**
 * @param {Object} obj the object on which we want to delete a property
 * @param {Array} addr addressArray on which to delete the property
 */
function deleteByAddress(obj, addr) {
    let current = obj;
    for (let i = 0; i < addr.length - 2; i++)
        current = current[addr[i]];
    delete current[addr[addr.length - 1]];
}
exports.deleteByAddress = deleteByAddress;
/** @return undefined if cannot find _id */
function getId(obj = {}) {
    if (!obj)
        return; // null case
    if (obj._id)
        return obj._id.toString();
    else if (isType(obj, 'objectId'))
        return obj.toString();
}
exports.getId = getId;
/**
 * @returns {array} return values of all callbacks
 */
function forI(nbIterations, callback) {
    const results = [];
    for (let i = 0; i < nbIterations; i++) {
        const prevValue = results[results.length - 1];
        results.push(callback(i, prevValue, results));
    }
    return results;
}
exports.forI = forI;
async function forIasync(nbIterations, callback) {
    const results = [];
    for (let i = 0; i < nbIterations; i++) {
        results.push(await callback(i));
    }
    return results;
}
exports.forIasync = forIasync;
function cleanStackTrace(stack) {
    if (typeof stack !== 'string')
        return '';
    stack.replace(/home\/[^/]+\/[^/]+\//g, '');
    const lines = stack.split('\n');
    const removeIfContain = [
        'logger-utils.js',
        'TCP.onread',
        'readableAddChunk',
        'Socket.EventEmitter.emit (domain.js',
        'Socket.emit (events.js',
        'Connection.EventEmitter.emit (domain.js',
        'Connection.emit (events.js',
        'Socket.Readable.push (_stream_readable',
        'model.Query',
        'Object.promiseOrCallback',
        'Connection.<anonymous>',
        'process.topLevelDomainCallback',
        // internal
        'internal/process',
        'internal/timers',
        'internal/modules',
        'internal/main',
        'DefaultError.throw',
        'Object.throw',
        'mongoose/lib/utils',
        'at Array.forEach (<anonymous>)',
    ];
    const linesClean = lines
        .filter(l => !removeIfContain.some(text => l.includes(text)))
        .map((line, i) => {
        if (i === 0)
            return '';
        else {
            const [, start, fileName, end] = line.match(/(^.+\/)([^/]+:\d+:\d+)(.{0,3})/) || [];
            return fileName ? `\x1b[2m${start}\x1b[0m${fileName}\x1b[2m${end}\x1b[0m` : `\x1b[2m${line}\x1b[0m`;
        }
    })
        .join('\n');
    return linesClean;
}
exports.cleanStackTrace = cleanStackTrace;
function isset(...elms) {
    return elms.every(elm => typeof elm !== 'undefined' && elm !== null);
}
exports.isset = isset;
function removeCircularJSONstringify(object, indent = 2) {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
    return JSON.stringify(object, getCircularReplacer(), indent);
}
exports.removeCircularJSONstringify = removeCircularJSONstringify;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
exports.shuffleArray = shuffleArray;
exports.randomizeArray = shuffleArray;
/**Eg: camelCase */
function camelCase(...wordBits) {
    return wordBits.filter(e => e).map((w, i) => i === 0 ? w : capitalize1st(w)).join('');
}
exports.camelCase = camelCase;
/**Eg: snake_case
 * trimmed but not lowerCased
 */
function snakeCase(...wordBits) {
    return wordBits.filter(e => e).map(w => w.trim()).join('_');
}
exports.snakeCase = snakeCase;
exports.underscoreCase = snakeCase;
/**Eg: kebab-case
 * trimmed AND lowerCased
 * undefined, null... => ''
 */
function kebabCase(...wordBits) {
    return wordBits.filter(e => e).map(w => w.trim().toLowerCase()).join('-');
}
exports.kebabCase = kebabCase;
exports.dashCase = kebabCase;
/**Eg: PascalCase undefined, null... => '' */
function pascalCase(...wordBits) {
    return wordBits.filter(e => e).map((w, i) => capitalize1st(w)).join('');
}
exports.pascalCase = pascalCase;
/**Eg: Titlecase undefined, null... => '' */
function titleCase(...wordBits) {
    return capitalize1st(wordBits.filter(e => e).map(w => w.trim()).join(''));
}
exports.titleCase = titleCase;
/**Eg: UPPERCASE undefined, null... => '' */
function upperCase(...wordBits) {
    return wordBits.filter(e => e).map(w => w.trim().toUpperCase()).join('');
}
exports.upperCase = upperCase;
/**Eg: lowercase undefined, null... => '' */
function lowerCase(...wordBits) {
    return wordBits.filter(e => e).map(w => w.trim().toLowerCase()).join('');
}
exports.lowerCase = lowerCase;
function capitalize1st(str = '') { return str[0].toUpperCase() + str.slice(1); }
exports.capitalize1st = capitalize1st;
function camelCaseToWords(str) {
    return str ? str.trim().replace(/([A-Z])/g, '-$1').toLowerCase().split('-') : [];
}
exports.camelCaseToWords = camelCaseToWords;
function escapeRegexp(str, config = {}) {
    const { parseStarChar = false } = config;
    if (parseStarChar)
        return str.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.*');
    else
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
exports.escapeRegexp = escapeRegexp;
/** Get first match of the first capturing group of regexp
 * Eg: const basePath = firstMatch(apiFile, /basePath = '(.*?)'/); will get what is inside quotes
 */
function firstMatch(str, regExp) { return (str.match(regExp) || [])[1]; }
exports.firstMatch = firstMatch;
/** Get all matches from regexp with g flag
 * Eg: [ [full, match1, m2], [f, m1, m2]... ]
 * NOTE: the G flag will be appended to regexp
 */
function allMatches(str, reg) {
    let i = 0;
    let matches;
    const arr = [];
    if (typeof str !== 'string')
        C.error('Not a string provided as first argument for allMatches()');
    else {
        reg = new RegExp(reg, 'g');
        while ((matches = reg.exec(str))) {
            arr.push(matches);
            if (i++ > 99) {
                C.error('error', 'Please provide the G flag in regexp for allMatches');
                break;
            }
        }
    }
    return arr;
}
exports.allMatches = allMatches;
/** GIVEN A STRING '{ blah;2}, ['nested,(what,ever)']' AND A SEPARATOR ",""
 *  This will return the content separated by first level of separators
 *  @return ["{ blah;2}", "['nested,(what,ever)']"]
 */
function getValuesBetweenSeparator(str, separator, removeTrailingSpaces = true) {
    err500IfEmptyOrNotSet({ separator, str });
    const { outer } = getValuesBetweenStrings(str, separator, undefined, undefined, undefined, removeTrailingSpaces);
    return outer;
}
exports.getValuesBetweenSeparator = getValuesBetweenSeparator;
/** GIVEN A STRING "a: [ 'str', /[^]]/, '[aa]]]str', () => [ nestedArray ] ], b: ['arr']"
 * @return matching: [ "'str', /[^]]/, '[aa]]]str', () => [ nestedArray ]", "'arr'" ], between: [ "a:", ", b: " ]
 * @param str base string
 * @param openingOrSeparator opening character OR separator if closing not set
 * @param closing
 * @param ignoreBetweenOpen default ['\'', '`', '"', '/'], when reaching an opening char, it will ignore all until it find the corresponding closing char
 * @param ignoreBetweenClose default ['\'', '`', '"', '/'] list of corresponding closing chars
 */
function getValuesBetweenStrings(str, openingOrSeparator, closing, ignoreBetweenOpen = ['\'', '`', '"', '/'], ignoreBetweenClose = ['\'', '`', '"', '/'], removeTrailingSpaces = true) {
    err500IfEmptyOrNotSet({ openingOrSeparator, str });
    str = str.replace(/<</g, '§§"').replace(/>>/g, '"§§');
    const arrayValues = [];
    const betweenArray = [];
    let level = 0;
    let ignoreUntil = false;
    let actualValue = '';
    let precedingChar = '';
    let separatorMode = false;
    if (!closing)
        separatorMode = true;
    const separator = separatorMode ? openingOrSeparator : false;
    const openingChars = separatorMode ? ['(', '{', '['] : [openingOrSeparator];
    const closingChars = separatorMode ? [')', '}', ']'] : [closing];
    const pushActualValue = () => {
        if (level === 0)
            betweenArray.push(removeTrailingSpaces ? actualValue.replace(/(?:^\s+|\s+$)/g, '') : actualValue);
        else
            arrayValues.push(removeTrailingSpaces ? actualValue.replace(/(?:^\s+|\s+$)/g, '') : actualValue);
        actualValue = '';
    };
    str.split('').forEach(char => {
        // handle unwanted nested structure like characters in a strings that may be a unmatched closing / opening character
        // Eg: {'azer}aze'}
        if (ignoreUntil && char === ignoreUntil && precedingChar !== '\\')
            ignoreUntil = false;
        else if (ignoreUntil && char !== ignoreUntil)
            true;
        else if (ignoreBetweenOpen.includes(char)) {
            const indexChar = ignoreBetweenOpen.findIndex(char2 => char2 === char);
            ignoreUntil = ignoreBetweenClose[indexChar];
        }
        else if (openingChars.includes(char)) {
            // handle nested structures
            if (!separatorMode && level === 0)
                pushActualValue();
            level++;
            if (!separatorMode)
                return;
        }
        else if (closingChars.includes(char)) {
            // handle nested structures
            if (!separatorMode && level === 1)
                pushActualValue();
            level--;
        }
        else if (separatorMode && level === 0 && char === separator) {
            // SEPARATOR MODE
            pushActualValue();
            return;
        }
        actualValue += char;
        precedingChar = char;
    });
    pushActualValue();
    const replaceValz = arr => arr.map(v => v.replace(/§§"/g, '<<').replace(/"§§/g, '>>')).filter(v => v);
    return { inner: replaceValz(arrayValues), outer: replaceValz(betweenArray) };
}
exports.getValuesBetweenStrings = getValuesBetweenStrings;
function issetOr(...elms) { return elms.some(elm => typeof elm !== 'undefined' && elm !== null); }
exports.issetOr = issetOr;
exports.orIsset = issetOr;
function isEmptyOrNotSet(...elms) { return elms.some(elm => !isset(elm) || isEmpty(elm)); }
exports.isEmptyOrNotSet = isEmptyOrNotSet;
function errIfNotSet(objOfVarNamesWithValues, additionalMessage) { return errXXXIfNotSet(422, false, objOfVarNamesWithValues); }
exports.errIfNotSet = errIfNotSet;
function err500IfNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, false, objOfVarNamesWithValues); }
exports.err500IfNotSet = err500IfNotSet;
function errIfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(422, true, objOfVarNamesWithValues); }
exports.errIfEmptyOrNotSet = errIfEmptyOrNotSet;
function err500IfEmptyOrNotSet(objOfVarNamesWithValues) { return errXXXIfNotSet(500, true, objOfVarNamesWithValues); }
exports.err500IfEmptyOrNotSet = err500IfEmptyOrNotSet;
function errXXXIfNotSet(errCode, checkEmpty, objOfVarNamesWithValues) {
    let missingVars = [];
    for (let prop in objOfVarNamesWithValues) {
        if (!isset(objOfVarNamesWithValues[prop]) || (checkEmpty && isEmpty(objOfVarNamesWithValues[prop])))
            missingVars.push(prop);
    }
    if (missingVars.length)
        throw new dataValidationUtilErrorHandler(`requiredVariableEmptyOrNotSet`, errCode, { origin: 'Validator', varNames: missingVars.join(', ') });
}
exports.errXXXIfNotSet = errXXXIfNotSet;
function isDateObject(variable) { return variable instanceof Date; }
exports.isDateObject = isDateObject;
/** Check all values are set */
function checkAllObjectValuesAreEmpty(o) { return Object.values(o).every(value => !isset(value)); }
exports.checkAllObjectValuesAreEmpty = checkAllObjectValuesAreEmpty;
/** Throw an error in case data passed is not a valid ctx */
function checkCtxIntegrity(ctx) {
    if (!isset(ctx) || !isset(ctx.user))
        throw new dataValidationUtilErrorHandler('ctxNotSet', 500);
}
exports.checkCtxIntegrity = checkCtxIntegrity;
function validator(...paramsToValidate) {
    const errArray = validatorReturnErrArray(...paramsToValidate);
    if (errArray.length)
        throw new dataValidationUtilErrorHandler(...errArray);
}
exports.validator = validator;
exports.required = validator;
const restTestMini = {
    throwOnErr: false,
    reset(throwOnErr = false) {
        restTestMini.nbSuccess = 0;
        restTestMini.nbError = 0;
        restTestMini.lastErrors = [];
        restTestMini.throwOnErr = throwOnErr;
    },
    newErr(err) {
        restTestMini.nbError++;
        restTestMini.lastErrors.push(err);
        if (restTestMini.throwOnErr)
            throw new Error(err);
        else
            C.error(false, err);
    },
    printStats() {
        // TODO print last errz
        C.info(`ERRORS RESUME =========`);
        if (restTestMini.lastErrors.length)
            C.log('\n\n\n');
        for (const lastErr of restTestMini.lastErrors)
            C.error(false, lastErr);
        C.log('\n\n\n');
        C.info(`STATS =========`);
        C.info(`Total: ${restTestMini.nbSuccess + restTestMini.nbError}`);
        C.success(`Success: ${restTestMini.nbSuccess}`);
        C.error(false, `    Errors: ${restTestMini.nbError}`);
    },
    nbSuccess: 0,
    nbError: 0,
    lastErrors: []
};
exports.restTestMini = restTestMini;
function assert(msg, value, validatorObject = {}) {
    try {
        if (typeof validatorObject !== 'object')
            validatorObject = { eq: validatorObject };
        const issetCheck = isEmpty(validatorObject);
        validatorObject.value = value;
        validatorObject.name = msg;
        const [errMsg, , extraInfos] = validatorReturnErrArray(validatorObject);
        const msg2 = msg + ` ${issetCheck ? 'isset' : `${JSON.stringify({ ...validatorObject, name: undefined, value: undefined })}`}`;
        if (!isset(errMsg)) {
            restTestMini.nbSuccess++;
            C.success(msg2);
        }
        else {
            const err = msg2 + `\n    ${errMsg}\n    ${JSON.stringify(extraInfos)}`;
            restTestMini.newErr(err);
        }
    }
    catch (err) {
        restTestMini.newErr(err);
    }
}
exports.assert = assert;
/** Same as validator but return a boolean
 * See {@link validator}
 */
function isValid(...paramsToValidate) {
    const errArray = validatorReturnErrArray(...paramsToValidate);
    return errArray.length ? false : true;
}
exports.isValid = isValid;
/** Default types + custom types
 * 'objectId','dateInt6','dateInt','dateInt8','dateInt12','time','humanReadableTimestamp','date','array','object','buffer','string','function','boolean','number','bigint',
 */
function isType(value, type) { return isValid({ name: 'Is type check', value, type }); }
exports.isType = isType;
function validatorReturnErrArray(...paramsToValidate) {
    let paramsFormatted = [];
    // support for multiple names with multiple values for one rule. Eg: {name: [{startDate:'20180101'}, {endDate:'20180101'}], type: 'dateInt8'}
    paramsToValidate.forEach(param => {
        if (typeof param !== 'object' || Array.isArray(param))
            throw new dataValidationUtilErrorHandler(`wrongTypeForDataValidatorArgument`, 500, { origin: 'Generic validator', expected: 'object', actualType: Array.isArray(param) ? 'array' : typeof param });
        // parse => name: {myVar1: 'blah, myvar2: myvar2}
        if (typeof param.name === 'object' && !Array.isArray(param.name))
            Object.keys(param.name).forEach(name => paramsFormatted.push(Object.assign({}, param, { name: name, value: param.name[name] })));
        else
            paramsFormatted.push(param);
    });
    for (const paramObj of paramsFormatted) {
        let name = paramObj.name;
        let value = paramObj.value;
        let optional = paramObj.optional || false;
        let emptyAllowed = optional || paramObj.emptyAllowed || false;
        const errMess = (msg, extraInfos = {}, errCode = 422) => [msg, errCode, { origin: 'Generic validator', varName: name, gotValue: isset(value) && isset(value.data) && isset(value.data.data) ? { ...value, data: 'Buffer' } : value, ...extraInfos }];
        // accept syntax { 'myVar.var2': myVar.var2, ... }
        if (!isset(name)) {
            name = Object.keys(paramObj).find(param => !['in', 'eq', 'lte', 'gte', 'name', 'value', 'type', 'regexp', 'minLength', 'maxLength', 'optional', 'emptyAllowed', 'mustNotBeSet', 'includes', 'length'].includes(param));
            if (isset(name))
                value = paramObj[name]; // throw new dataValidationUtilErrorHandler('noNameProvidedForDataValidator', 500, { origin: 'Generic validator', });
        }
        // if nameString ends by $ sign it is optional
        if (isset(name) && /.*\$$/.test(name)) {
            name = name.substr(0, name.length - 1);
            optional = true;
        }
        // DEFINED AND NOT EMPTY
        if (!isset(value) && optional)
            continue;
        if (isset(value) && paramObj.mustNotBeSet)
            return errMess('variableMustNotBeSet');
        if (paramObj.mustNotBeSet)
            continue; // exit
        if (!isset(value))
            return errMess('requiredVariableEmptyOrNotSet');
        if (!emptyAllowed && value === '')
            return errMess('requiredVariableEmpty');
        const isArray = paramObj.isArray;
        if (isArray && !Array.isArray(value))
            return errMess('wrongTypeForVar', { expectedTypes: 'array', gotType: typeof value });
        // TYPE
        if (isset(paramObj.type)) {
            const types = asArray(paramObj.type); // support for multiple type
            const areSomeTypeValid = types.some(type => {
                if (type.endsWith('[]')) {
                    if (!Array.isArray(value))
                        errMess('wrongTypeForVar', { expectedTypes: 'array', gotType: typeof value });
                    type = type.replace('[]', '');
                }
                const allTypes = [
                    'objectId',
                    'dateInt6',
                    'dateInt',
                    'dateInt8',
                    'dateInt12',
                    'time',
                    'humanReadableTimestamp',
                    'date',
                    'dateObject',
                    'array',
                    'object',
                    'buffer',
                    'string',
                    'function',
                    'boolean',
                    'number',
                    'bigint',
                    'year',
                    'any',
                    //...Object.keys(configFn().customTypes)
                ];
                if (!allTypes.includes(type))
                    throw new dataValidationUtilErrorHandler('typeDoNotExist', 500, { type });
                const basicTypeCheck = {
                    objectId: val => /^[0-9a-fA-F-]{24,}$/.test(val),
                    dateInt6: val => isDateIntOrStringValid(parseInt(val + '01'), true, 8),
                    dateInt: val => isDateIntOrStringValid(val, true, 8),
                    dateInt8: val => isDateIntOrStringValid(val, true, 8),
                    dateInt12: val => isDateIntOrStringValid(val, true, 12),
                    time: val => /^\d\d:\d\d$/.test(val) && isTimeStringValid(val),
                    humanReadableTimestamp: val => (val + '').length === 17,
                    date: val => isDateIsoOrObjectValid(val, true),
                    dateObject: val => isDateIsoOrObjectValid(val, true),
                    array: val => Array.isArray(val),
                    object: val => !Array.isArray(val) && val !== null && typeof val === type,
                    buffer: val => Buffer.isBuffer(val),
                    year: val => /^\d\d\d\d$/.test(val),
                    any: () => true,
                };
                return isset(basicTypeCheck[type]) && basicTypeCheck[type](value) ||
                    typeof value === type && type !== 'object' || // for string, number, boolean...
                    isset(configFn().customTypes[type]) && configFn().customTypes[type].test(value);
            });
            if (!areSomeTypeValid)
                return errMess(`wrongTypeForVar`, { expectedTypes: types.join(', '), gotType: Object.prototype.toString.call(value) });
        }
        // GREATER / LESS
        if (isset(paramObj.gte) && value < paramObj.gte)
            return errMess(`valueShouldBeSuperiorOrEqualForVar`, { shouldBeSupOrEqTo: paramObj.gte });
        if (isset(paramObj.lte) && value > paramObj.lte)
            return errMess(`valueShouldBeInferiorOrEqualForVar`, { shouldBeInfOrEqTo: paramObj.lte });
        if (isset(paramObj.gt) && value <= paramObj.gt)
            return errMess(`valueShouldBeSuperiorForVar`, { shouldBeSupOrEqTo: paramObj.gt });
        if (isset(paramObj.lt) && value >= paramObj.lt)
            return errMess(`valueShouldBeInferiorForVar`, { shouldBeInfOrEqTo: paramObj.lt });
        // IN VALUES
        if (isset(paramObj.in)) {
            const equals = Array.isArray(paramObj.in) ? paramObj.in : [paramObj.in];
            if (!equals.some(equalVal => equalVal === value))
                return errMess(`wrongValueForVar`, { supportedValues: JSON.stringify(equals) });
        }
        // EQUAL (exact copy of .in)
        if (paramObj.hasOwnProperty('eq')) {
            const equals = Array.isArray(paramObj.eq) ? paramObj.eq : [paramObj.eq];
            if (!equals.some(equalVal => equalVal === value))
                return errMess(`wrongValueForVar`, { supportedValues: equals.join(', '), });
        }
        // NOT EQUAL
        if (paramObj.hasOwnProperty('neq')) {
            const notEquals = Array.isArray(paramObj.neq) ? paramObj.neq : [paramObj.neq];
            if (notEquals.some(equalVal => equalVal === value))
                return errMess(`wrongValueForVar`, { NOTsupportedValues: notEquals.join(', ') });
        }
        // INCLUDES
        if (isset(paramObj.includes) && !value.includes(paramObj.includes))
            return errMess(`wrongValueForVar`, { shouldIncludes: paramObj.includes });
        // REGEXP
        if (isset(paramObj.regexp) && !paramObj.regexp.test(value))
            return errMess(`wrongValueForVar`, { shouldMatchRegexp: paramObj.regexp.toString() });
        // MIN / MAX LENGTH works for number length. Eg: 20180101.length == 8
        if (isset(paramObj.minLength) && paramObj.minLength > (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { minLength: paramObj.minLength });
        if (isset(paramObj.maxLength) && paramObj.maxLength < (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { maxLength: paramObj.maxLength });
        if (isset(paramObj.length) && paramObj.length !== (typeof value == 'number' ? value + '' : value).length)
            return errMess(`wrongLengthForVar`, { length: paramObj.length });
    }
    return [];
}
exports.validatorReturnErrArray = validatorReturnErrArray;
function isEmpty(objOrArr) {
    if (Array.isArray(objOrArr) || typeof objOrArr === 'string')
        return objOrArr.length === 0;
    else if (typeof objOrArr == 'object' && objOrArr !== null && !(objOrArr instanceof Date))
        return Object.keys(objOrArr).length === 0;
    else
        false;
}
exports.isEmpty = isEmpty;
function err422IfNotSet(o) {
    let m = [];
    for (let p in o)
        if (!isset(o[p]))
            m.push(p);
    if (m.length)
        throw new dataValidationUtilErrorHandler(`requiredVariableEmptyOrNotSet`, 422, { origin: 'Validator', varNames: m.join(', ') });
}
function getDateAsInt12(dateAllFormat, errIfNotValid) { return getDateAsInt(dateAllFormat, errIfNotValid, true); } // alias
exports.getDateAsInt12 = getDateAsInt12;
function humanReadableTimestamp(dateAllFormat) {
    if (isset(dateAllFormat))
        dateAllFormat = getDateAsObject(dateAllFormat);
    return parseInt(getDateAsInt12(dateAllFormat) + pad((dateAllFormat || new Date()).getUTCSeconds()) + pad((dateAllFormat || new Date()).getUTCMilliseconds(), 3));
}
exports.humanReadableTimestamp = humanReadableTimestamp;
/** format for 6/8/2018 => 20180806
 * @param dateAllFormat multiple format allowed 2012, 20120101, 201201011200, new Date(), "2019-12-08T16:19:10.341Z" and all string that new Date() can parse
 */
function getDateAsInt(dateAllFormat = new Date(), errIfNotValid$ = false, withHoursAndMinutes$ = false) {
    let dateInt;
    if (typeof dateAllFormat === 'string' && dateAllFormat.includes('/')) {
        // 01/01/2020 format
        const [d, m, y] = dateAllFormat.split('/');
        return y + m.toString().padStart(2, '0') + d.toString().padStart(2, '0');
    }
    else if (isDateIntOrStringValid(dateAllFormat)) {
        // we can pass an int or string format (20180106)
        dateInt = (dateAllFormat + '00000000').substr(0, 12); // add default 000000 for "month days minutes:sec" if not set
    }
    else {
        let date = dateAllFormat;
        if (typeof date === 'string')
            date = new Date(date);
        const realDate = date;
        //let dateArr = dateAllFormat.toString().split(); // we cannot use ISOString
        dateInt = '' + realDate.getUTCFullYear() + pad(realDate.getUTCMonth() + 1) + pad(realDate.getUTCDate()) + pad(realDate.getUTCHours()) + pad(realDate.getUTCMinutes());
    }
    isDateIntOrStringValid(dateInt, errIfNotValid$);
    return (withHoursAndMinutes$ ? dateInt : dateInt.substr(0, 8));
}
exports.getDateAsInt = getDateAsInt;
exports.convertDateAsInt = getDateAsInt;
function getMonthAsInt(dateAllFormat = new Date()) {
    let dateInt;
    if (isDateIntOrStringValid(dateAllFormat)) {
        // we can pass an int or string format (20180106)
        dateInt = (dateAllFormat + '').substr(0, 6);
    }
    else {
        let date = dateAllFormat;
        if (typeof date === 'string')
            date = new Date(date);
        //let dateArr = dateAllFormat.toString().split(); // we cannot use ISOString
        dateInt = '' + date.getUTCFullYear() + pad(date.getUTCMonth() + 1);
    }
    return int(dateInt);
}
exports.getMonthAsInt = getMonthAsInt;
/**
 * @param dateAllFormat multiple format allowed 2012, 20120101, 201201011200, new Date(), "2019-12-08T16:19:10.341Z" and all string that new Date() can parse
 */
function getDateAsObject(dateAllFormat = new Date(), errIfNotValid$ = true) {
    let dateObj = dateAllFormat;
    if (isDateIntOrStringValid(dateAllFormat)) {
        const [y, M, d, h, m] = dateStringToArray(dateAllFormat);
        dateObj = new Date(`${y}-${M}-${d}T${h}:${m}`);
    }
    else if (typeof dateAllFormat === 'string') {
        dateObj = new Date(dateAllFormat);
    }
    else {
        dateObj = new Date(dateAllFormat.getTime()); // clone
    }
    isDateIsoOrObjectValid(dateObj, errIfNotValid$);
    return dateObj;
}
exports.getDateAsObject = getDateAsObject;
exports.convertDateAsObject = getDateAsObject;
function isDateIntOrStringValid(dateStringOrInt, outputAnError = false, length) {
    if (!isset(dateStringOrInt))
        return false;
    const dateStr = dateStringOrInt.toString();
    if (length && dateStr.length !== length)
        throw new dataValidationUtilErrorHandler(`wrongLengthForDateInt`, 422, { origin: 'Date Int validator', dateStringOrInt: dateStringOrInt, extraInfo: `${dateStringOrInt} length !== ${length}` });
    if ((typeof dateStringOrInt === 'object' && isNaN(int(dateStr))) || ![4, 6, 8, 10, 12, 17].includes(dateStr.length))
        return false;
    const dateArr = dateStringToArray(dateStringOrInt);
    const [y, M, d, h, m] = dateArr;
    const test1 = dateArr.length >= 3 && int(y) >= 1000; // Y
    const test2 = int(M) <= 12 && int(M) > 0; // M
    const test3 = !isset(d) || int(d) <= 31 && int(d) > 0; // D
    const test4 = !isset(h) || (int(h) <= 23 && int(h) >= 0); // H
    const test5 = !isset(m) || (int(m) <= 59 && int(m) >= 0); // M
    if (outputAnError && !(test1 && test2 && test3 && test4 && test5))
        throw new dataValidationUtilErrorHandler(`dateStringOrIntFormatInvalid`, 422, { origin: 'Date Int validator', dateStringOrInt: dateStringOrInt, extraInfo: 'Needs YYYYMMDD[HHMM] between 100001010000 and 999912312359', dateArr, isYearValid: test1, isMonthValid: test2, isDayValid: test3, isHourValid: test4, isMinutesValid: test5 });
    return true;
}
exports.isDateIntOrStringValid = isDateIntOrStringValid;
function isDateIsoOrObjectValid(dateIsoOrObj, outputAnError = false) {
    let dateObj = dateIsoOrObj;
    if (typeof dateIsoOrObj === 'string')
        dateObj = new Date(dateIsoOrObj);
    let valid = dateObj instanceof Date;
    if (outputAnError && !valid)
        throw new dataValidationUtilErrorHandler('dateIsoStringOrObjectIsNotValid', 422, { origin: 'Date Object validator', isoDate: dateIsoOrObj });
    return valid;
}
exports.isDateIsoOrObjectValid = isDateIsoOrObjectValid;
/** [2018,01,06] */
function dateStringToArray(strOrInt) {
    err422IfNotSet({ strOrInt });
    const dateStr = strOrInt.toString();
    return [
        dateStr.substr(0, 4),
        dateStr.substr(4, 2) || '01',
        dateStr.substr(6, 2) || '01',
        dateStr.substr(8, 2) || '12',
        dateStr.substr(10, 2) || '00',
        dateStr.substr(12, 2) || '00',
        dateStr.substr(14, 3) || '000', // MS
    ];
}
exports.dateStringToArray = dateStringToArray;
/**
 * @param dateAllFormat default: actualDate
 * @returns ['01', '01', '2019'] OR **string** if separator is provided */
function dateArray(dateAllFormat = getDateAsInt()) {
    const dateStr = getDateAsInt(dateAllFormat).toString();
    return [
        dateStr.substr(6, 2),
        dateStr.substr(4, 2),
        dateStr.substr(0, 4), // Y
    ];
}
exports.dateArray = dateArray;
/**
 * @param dateAllFormat default: actualDate
 * @returns ['01', '01', '2019'] OR **string** if separator is provided */
function dateArrayInt(dateAllFormat = getDateAsInt()) {
    const dateStr = getDateAsInt(dateAllFormat).toString();
    return [
        int(dateStr.substr(6, 2)),
        int(dateStr.substr(4, 2)),
        int(dateStr.substr(0, 4)), // Y
    ];
}
exports.dateArrayInt = dateArrayInt;
/**
 * @return 01/01/2012 (alias of dateArrayFormatted(date, '/'))
 */
function dateFormatted(dateAllFormat, separator = '/') { return dateArray(dateAllFormat).join(separator); }
exports.dateSlash = dateFormatted;
exports.dateFormatted = dateFormatted;
/** Date with custom offset (Ex: +2 for France) */
function dateOffset(offsetHours, dateObj = new Date()) {
    var utc = Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds());
    return new Date(utc + (3600000 * offsetHours));
}
exports.dateOffset = dateOffset;
//----------------------------------------
// TIME UTILS
//----------------------------------------
/**  */
function getTimeAsInt(timeOrDateInt = getDateAsInt12()) {
    if (isDateIntOrStringValid(timeOrDateInt)) {
        const tl = timeOrDateInt.toString().length;
        return int(timeOrDateInt.toString().substring(tl - 4, tl));
    }
    else if (typeof timeOrDateInt === 'string' && timeOrDateInt.length === 5 && timeOrDateInt.includes(':'))
        return int(timeOrDateInt.replace(':', ''));
    else
        return 'dateInvalid';
}
exports.getTimeAsInt = getTimeAsInt;
/**
 * @param {timeInt|dateInt12} Eg: 2222 OR 201201012222. Default, actual dateInt12
 * @param {String} separator default: ":"
 */
function getIntAsTime(intOrDateTimeInt = getDateAsInt12(), separator = ':') {
    const time = intOrDateTimeInt.toString().padStart(4, '0');
    const tl = time.length;
    return time.substring(tl - 4, tl - 2) + separator + time.substring(tl - 2, tl);
}
exports.getIntAsTime = getIntAsTime;
function isTimeStringValid(timeStr, outputAnError$ = false) {
    let timeArr = timeStr.split(':');
    let h = int(timeArr[0]);
    let m = int(timeArr[1]);
    let test1 = h >= 0 && h < 24;
    let test2 = m >= 0 && m < 60;
    if (outputAnError$ && !(test1 && test2))
        throw new dataValidationUtilErrorHandler('timeStringOutOfRange', 422, { origin: 'Time validator' });
    else
        return test1 && test2;
}
exports.isTimeStringValid = isTimeStringValid;
//----------------------------------------
// DURATIONS
//----------------------------------------
function getDuration(startDate, endDate, inMinutes = false) {
    const startDateO = getDateAsObject(startDate);
    const endDateO = getDateAsObject(endDate);
    let diffInSec = Math.floor(endDateO.getTime() / 1000) - Math.floor(startDateO.getTime() / 1000);
    if (inMinutes)
        return Math.floor(diffInSec / 60);
    else
        return [
            Math.floor(diffInSec / (24 * 3600)),
            Math.floor((diffInSec % (24 * 3600)) / 3600),
            Math.floor(((diffInSec % (24 * 3600)) % 3600) / 60), // M
        ];
}
exports.getDuration = getDuration;
/** compare two object with DATE INT, if they overlap return true
 * @param {Object} event1 {startDate, endDate}
 * @param {Object} event2 {startDate, endDate}
 * @param {String} fieldNameForStartDate$ replace startDate with this string
 * @param {String} fieldNameForEndDate$ replace endDate with this string
 * @param {Boolean} allowNull$ if false, retrun false if any of the startdates or enddates are not set
 * @param {Boolean} strict$ if true,
 */
function doDateOverlap(event1, event2, fieldNameForStartDate$ = 'startDate', fieldNameForEndDate$ = 'endDate', allowNull$ = true, strict$ = false) {
    if (!allowNull$ && !isset(event1[fieldNameForStartDate$], event1[fieldNameForEndDate$], event2[fieldNameForStartDate$], event2[fieldNameForEndDate$]))
        return false;
    if (strict$)
        return (!event2[fieldNameForEndDate$] || event1[fieldNameForStartDate$] < event2[fieldNameForEndDate$]) && (!event1[fieldNameForEndDate$] || event1[fieldNameForEndDate$] > event2[fieldNameForStartDate$]);
    return (!event2[fieldNameForEndDate$] || event1[fieldNameForStartDate$] <= event2[fieldNameForEndDate$]) && (!event1[fieldNameForEndDate$] || event1[fieldNameForEndDate$] >= event2[fieldNameForStartDate$]);
}
exports.doDateOverlap = doDateOverlap;
function nextWeekDay(fromDate, weekDayInt, outputFormat = 'date', sameDayAllowed = false) {
    const date = getDateAsObject(fromDate);
    if (!isset(weekDayInt))
        weekDayInt = date.getDay();
    const toAdd = !sameDayAllowed && date.getDay() === weekDayInt ? 7 : 0;
    date.setUTCDate(date.getUTCDate() + toAdd + (7 + weekDayInt - date.getUTCDay()) % 7);
    return getDateAs(date, outputFormat);
}
exports.nextWeekDay = nextWeekDay;
function addDays(dateAllFormat = getDateAsInt(), numberOfDays = 1, outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    date.setTime(date.getTime() + numberOfDays * 24 * 60 * 60 * 1000);
    return getDateAs(date, outputFormat);
}
exports.addDays = addDays;
function addMinutes(dateAllFormat = getDateAsInt(), numberOfMinutes = 1, outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    date.setTime(date.getTime() + 1 * numberOfMinutes * 60 * 1000);
    return getDateAs(date, outputFormat);
}
exports.addMinutes = addMinutes;
function addHours(dateAllFormat = getDateAsInt(), numberOfHours = 1, outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    date.setTime(date.getTime() + 1 * numberOfHours * 60 * 60 * 1000);
    return getDateAs(date, outputFormat);
}
exports.addHours = addHours;
function addMonths(dateAllFormat = getDateAsInt(), numberOfMonths = 1, outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    date.setUTCMonth(date.getUTCMonth() + numberOfMonths);
    return getDateAs(date, outputFormat);
}
exports.addMonths = addMonths;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
function addYears(dateAllFormat = getDateAsInt(), numberOfYears = 1, outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    date.setUTCFullYear(date.getUTCFullYear() + numberOfYears);
    return getDateAs(date, outputFormat);
}
exports.addYears = addYears;
function getDayOfMonth(dateAllFormat = getDateAsInt()) {
    let dateAsInt = getDateAsInt(dateAllFormat);
    const [, , d] = dateStringToArray(dateAsInt);
    return d;
}
exports.getDayOfMonth = getDayOfMonth;
function getYear(dateAllFormat = getDateAsInt()) {
    let dateAsInt = getDateAsInt(dateAllFormat);
    const [y] = dateStringToArray(dateAsInt);
    return y;
}
exports.getYear = getYear;
function getHours(dateAllFormat = getDateAsInt()) {
    let dateAsInt = getDateAsInt(dateAllFormat);
    const [, , , h,] = dateStringToArray(dateAsInt);
    return h;
}
exports.getHours = getHours;
function getMinutes(dateAllFormat = getDateAsInt()) {
    let dateAsInt = getDateAsInt(dateAllFormat);
    const [, , , , m] = dateStringToArray(dateAsInt);
    return m;
}
exports.getMinutes = getMinutes;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
function lastDayOfMonth(dateAllFormat = getDateAsInt(), outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    const lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    lastDay.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    return getDateAs(lastDay, outputFormat);
}
exports.lastDayOfMonth = lastDayOfMonth;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
function firstDayOfMonth(dateAllFormat = getDateAsInt(), outputFormat = 'date') {
    let date = getDateAsObject(dateAllFormat);
    const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    firstDay.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    return getDateAs(firstDay, outputFormat);
}
exports.firstDayOfMonth = firstDayOfMonth;
function differenceInMilliseconds(startDateAllFormat, endDateAllFormat) {
    const startDate = getDateAsObject(startDateAllFormat);
    const endDate = getDateAsObject(endDateAllFormat);
    return endDate.getTime() - startDate.getTime();
}
exports.differenceInMilliseconds = differenceInMilliseconds;
function differenceInSeconds(startDateAllFormat, endDateAllFormat) {
    return differenceInMilliseconds(startDateAllFormat, endDateAllFormat) / 1000;
}
exports.differenceInSeconds = differenceInSeconds;
function differenceInMinutes(startDateAllFormat, endDateAllFormat) {
    return differenceInSeconds(startDateAllFormat, endDateAllFormat) / 60;
}
exports.differenceInMinutes = differenceInMinutes;
function differenceInHours(startDateAllFormat, endDateAllFormat) {
    return differenceInMinutes(startDateAllFormat, endDateAllFormat) / 60;
}
exports.differenceInHours = differenceInHours;
function differenceInDays(startDateAllFormat, endDateAllFormat) {
    return differenceInHours(startDateAllFormat, endDateAllFormat) / 24;
}
exports.differenceInDays = differenceInDays;
function differenceInWeeks(startDateAllFormat, endDateAllFormat) {
    return differenceInDays(startDateAllFormat, endDateAllFormat) / 7;
}
exports.differenceInWeeks = differenceInWeeks;
function getDateAs(dateAllFormat = new Date(), outputDateFormat = 'date') {
    switch (outputDateFormat) {
        case 'dateInt8':
            return getDateAsInt(dateAllFormat);
        case 'dateInt12':
            return getDateAsInt12(dateAllFormat);
        case 'humanReadableTimestamp':
            return humanReadableTimestamp(dateAllFormat);
        case 'date':
        default:
            return getDateAsObject(dateAllFormat);
    }
}
//----------------------------------------
// LOGGER
//----------------------------------------
const logger = {
    log(str, type = 'log') {
        const { preprocessLog } = configFn();
        if (typeof preprocessLog === 'function')
            str = preprocessLog(str) || str;
        if (isset(console[type]))
            console[type](str);
        else if (type === 'appError')
            console.warn(str);
        else
            console.log(str);
        logger.raw.push(str + `\n`);
        logger.raw = logger.raw.slice(logger.raw.length - configFn().nbOfLogsToKeep, logger.raw.length);
    },
    /**
     * @param {String[]|String} inputLogs
     */
    toHtml(inputLogs = [...logger.raw]) {
        if (!Array.isArray(inputLogs))
            inputLogs = [inputLogs];
        const code2css = {
            2: `opacity:.5`,
            32: `color:#679933`,
            31: `color:#A8383B`,
            33: `color:#D7941C`,
            35: `color:#C21949`,
            36: `color:#128C6D`,
            34: `color:#1B568B`, // blue
        };
        let htmlLogs = '';
        inputLogs.join('<br/>').split('\x1b[').forEach((bit, i) => {
            // the first doesn't have a preceding (may be undef)
            if (bit) {
                if (i !== 0) {
                    const [, code, R, G, B, content] = bit.match(/(^\d\d?)(?:;|m)(?:\d;(\d+);(\d+);(\d+)m)?(.*$)/) || [];
                    if (content) {
                        const style = !isset(R) ? isset(code) ? code2css[code] : undefined : `color:rgb(${R},${G},${B})`;
                        htmlLogs += isset(style) ? `<span style='${style}'>${content.replace(/\n/g, '<br>')}</span>` : content.replace(/\n/g, '<br>');
                    }
                }
                else
                    htmlLogs += bit.replace(/\n/g, '<br>');
            }
        });
        return `<div style='color:#ccc'>${htmlLogs}<br></div>`;
    },
    toText(inputLogs = [...logger.raw]) {
        const str = Array.isArray(inputLogs) ? inputLogs.join('\n') : inputLogs;
        return str.replace(/\x1b\[.*?m/g, '');
    },
    raw: [],
    json: [],
};
/**
// console colored output
// * console.log(C.green(C.dim('Hey bro !')))
// * or C.log() // will use padding and color defined by themes
// * or C.line('MY TITLE', 53)
// * or C.gradientize(myLongString)
*/
const C = {
    dim: str => C.output(2, str),
    green: str => C.output(32, str),
    red: str => C.output(31, str),
    yellow: str => C.output(33, str),
    grey: str => C.output(2, str),
    magenta: str => C.output(35, str),
    cyan: str => C.output(36, str),
    blue: str => C.output(34, str),
    primary: str => {
        const primary = configFn().terminal.theme.primary;
        return C.rgb(...primary) + str + C.reset;
    },
    reset: '\x1b[0m',
    output: (code, str = '') => configFn().terminal.noColor ? str : `\x1b[${code}m${str.toString().split('\n').join('\x1b[0m\n\x1b[2m')}\x1b[0m`,
    // true RGB colors B-*
    rgb: (r, g = 0, b = 0) => configFn().terminal.noColor || !isset(r, g, b) ? '' : `\x1b[38;2;${r};${g};${b}m`,
    bg: (r, g, b) => configFn().terminal.noColor || !isset(r, g, b) ? '' : `${'\x1b['}48;2;${r};${g};${b}m`,
    /** Output a line of title */
    line(title = '', length = configFn().terminal.theme.pageWidth, clr = configFn().terminal.theme.primary, char = '=', paddingX = configFn().terminal.theme.paddingX) {
        const padX = ' '.repeat(paddingX);
        this.log('\u00A0\n' + padX + this.rgb(...clr) + (title + ' ').padEnd(length, char) + this.reset + padX + '\u00A0\n');
    },
    /** Eg: ['cell1', 'cell2', 'cell3'], [25, 15] will start cell2 at 25 and cell 3 at 25 + 15
     * @param {Array} limits default divide the viewport
     */
    cols(strings, limits = [], clr = configFn().terminal.theme.fontColor, paddingX = configFn().terminal.theme.paddingX) {
        if (!limits.length) {
            const colWidth = Math.round(configFn().terminal.theme.pageWidth / strings.length);
            limits = Array(strings.length - 1).fill(2).map((itm, i) => colWidth * i + 1);
        }
        const str = strings.reduce((glob, str = '', i) => {
            const realCharLength = str.toString().replace(/\x1b\[.*?m/, '').length;
            const charLength = str.toString().length;
            const realLimit = limits[i] + charLength - realCharLength;
            return glob + str.toString().substring(0, realLimit || 999).padEnd(realLimit || 0, ' ');
        }, '');
        this.logClr(str, clr, paddingX);
    },
    /** Console log alias */
    log(...stringsCtxMayBeFirstParam) {
        stringsCtxMayBeFirstParam.forEach(str => this.logClr(str, undefined, undefined));
    },
    logClr(str, clr = configFn().terminal.theme.fontColor, paddingX = configFn().terminal.theme.paddingX) {
        if (!isset(str))
            return;
        const padX = ' '.repeat(paddingX);
        str = padX + (isset(clr) ? this.rgb(...clr) : '') + str.toString().replace(/\n/g, '\n' + padX + (isset(clr) ? this.rgb(...clr) : ''));
        logger.log(str + this.reset, 'log');
    },
    info(...str) {
        str.forEach((s, i) => {
            if (i === 0)
                this.logClr('ⓘ  ' + s, configFn().terminal.theme.primary);
            else
                this.log(this.dimStrSplit(s));
        });
        this.log(' ');
    },
    success(...str) {
        str.forEach((s, i) => {
            if (i === 0)
                this.log(this.green('✓  ' + s));
            else
                this.log(this.dimStrSplit(s));
        });
    },
    /** First param **false** to avoid logging stack trace */
    error: (...errors) => logErrPrivate('error', [255, 0, 0], ...errors),
    /** First param **false** to avoid logging stack trace */
    warning: (...str) => logErrPrivate('warn', [255, 122, 0], ...str),
    customError: (color, ...str) => logErrPrivate('error', color, ...str),
    customWarning: (color, ...str) => logErrPrivate('warn', color, ...str),
    applicationError: (color, ...str) => logErrPrivate('appError', color, ...str),
    warningLight: (color, ...str) => logErrPrivate('warn', [196, 120, 52], ...str),
    dimStrSplit(...logs) {
        let logsStr = [];
        logs.filter(isset).forEach(log => log.toString().split('\n').forEach(line => line && logsStr.push(this.dim(`    ${line}`))));
        return logsStr.join('\n');
    },
    notifShow() {
        console.log('\n\u00A0');
        this.notifications.forEach(fn => fn());
        this.notifications = [];
        console.log('\n\u00A0');
    },
    /** Keep in memory the logs to show when needed with C.notifShow()
     * Ex: C.notification('info', str); */
    notification(type, ...messages) {
        this.notifications.push(() => {
            if (isset(this[type])) {
                this[type](...messages);
            }
            else {
                this.warning('Wrong param for C.notification');
            }
        });
    },
    notifications: [],
    /** Gratientize lines of text (separated by \n) */
    gradientize(str = '', rgb1 = configFn().terminal.theme.shade1, rgb2 = configFn().terminal.theme.shade2, bgRgb = configFn().terminal.theme.bgColor, paddingY = configFn().terminal.theme.paddingY, paddingX = configFn().terminal.theme.paddingX) {
        const lines = str.split('\n');
        const largestLine = lines.reduce((sum, line) => sum < line.length ? line.length : sum, 0);
        const rgbParts = rgb1.map((val, i) => (val - rgb2[i]) / (lines.length));
        const bg = bgRgb ? this.bg(bgRgb[0], bgRgb[1], bgRgb[2]) : '';
        const padX = ' '.repeat(paddingX);
        const padLine = bg + padX + ' '.padEnd(largestLine, ' ') + padX + '\x1b[0m\n';
        console.log(padLine.repeat(paddingY) +
            lines.reduce((s, line, i) => {
                return s + bg + padX + this.rgb(...rgb1.map((val, i2) => Math.round(val - i * rgbParts[i2]))) + line.padEnd(largestLine, ' ') + padX + '\x1b[0m\n';
            }, '') +
            padLine.repeat(paddingY));
    },
    debugModeLog(title, ...string) {
        this.logClr('🐞 ' + title, configFn().terminal.theme.debugModeColor, 0);
        this.log(this.dimStrSplit(...string));
    },
    // DEPRECATED
    useTheme() { },
};
exports.C = C;
function logErrPrivate(type, color, ...errors) {
    const { isProd } = configFn();
    if (errors.length === 1 && typeof errors[0].log === 'function')
        return errors[0].log();
    let stackTrace = (new Error('')).stack || '';
    const displayStack = errors[0] === false ? errors.shift() : true;
    const symbol = type === 'error' ? '✘ ' : '⚠ ';
    if (errors.length > 1 && !isset(errors[0]))
        errors.shift();
    const getStringFromErr = (err, i) => {
        if (!isset(err))
            return '';
        else if (typeof err === 'string') {
            if (i === 0)
                return C.rgb(...color) + symbol + err + C.reset;
            else
                return err.split('\n').map(val => C.dim(val)).join('\n');
        }
        else if (err instanceof Error) {
            const { str, stackTrace: stkTrc } = stringifyInstanceOfError(err, type, color);
            if (stkTrc)
                stackTrace = stkTrc;
            return str;
        }
        else if (typeof err === 'object') {
            let msg = '';
            msg += removeCircularJSONstringify(err, 2).split('\n').map(val => C.dim(val)).join('\n') + '\n';
            const { str, stackTrace: stkTrc } = stringifyExtraInfos(err.extraInfo || err, type, color);
            if (stkTrc)
                stackTrace = stkTrc;
            msg += str;
            return msg;
        }
        else
            return '';
    };
    if (errors.length && errors[0]) {
        const messages = errors.map((e, i) => {
            if (typeof e.log === 'function') {
                e.log();
                return '';
            }
            else
                return getStringFromErr(e, i);
        });
        // Stack
        if (displayStack) {
            messages.push(isProd ? stackTrace : cleanStackTrace(stackTrace) + '\n');
        }
        logger.log(messages.join(''), type);
    }
}
function stringifyInstanceOfError(err, type = 'error', color = [255, 0, 0], level = 0) {
    if (level > 5)
        return { str: '' };
    let str = '';
    let stackTrace;
    const symbol = type === 'error' ? '✘ ' : '⚠ ';
    const title = err.msg || err.message || err.id || (err.stack ? err.stack.split('\n')[0] : 'Error');
    // Err mess
    str += C.rgb(...color) + symbol + title + C.reset + '\n';
    if (err.stack)
        stackTrace = err.stack; // more relevant
    // ExtraInfos
    if (isset(err.extraInfo)) {
        const { str: str2, stackTrace: stkTrc } = stringifyExtraInfos(err.extraInfo, type, color, level++);
        if (stkTrc)
            stackTrace = stkTrc;
        str += str2;
    }
    return { str, stackTrace };
}
function stringifyExtraInfos(extraInfoOriginal, type, color, level = 0) {
    let stackTrace;
    const originalError = [C.dim(`ORIGINAL ERROR ${'-'.repeat(39)}\n`)];
    if (extraInfoOriginal instanceof Error) { // case where error is passed directly to extraInfos
        return stringifyInstanceOfError(extraInfoOriginal, type, color);
    }
    else {
        const extraInfo = { ...extraInfoOriginal };
        const extraInfos = [C.dim(`EXTRA INFOS ${'-'.repeat(41)}\n`)];
        if (typeof extraInfo === 'object' && Object.keys(extraInfo).length) {
            for (const itemName in extraInfo) {
                if (extraInfo[itemName] instanceof Error) {
                    const { str, stackTrace: stkTrc } = stringifyInstanceOfError(extraInfo[itemName], type, color, level++);
                    originalError.push(str);
                    stackTrace = stkTrc;
                    delete extraInfo[itemName];
                }
            }
        }
        if (Object.keys(extraInfo).length) {
            extraInfos.push(removeCircularJSONstringify(extraInfo, 2)
                .replace(/(?:^\s*{(?:\n {2})?|}\s*$)/g, '')
                .replace(/\n {2}/g, '\n')
                .split('\n')
                .map(val => C.dim(val)).join('\n') + '\n');
        }
        return {
            str: (extraInfos.length > 1 ? extraInfos.join('') : '') + (originalError.length > 1 ? originalError.join('') + '\n' : ''),
            stackTrace
        };
    }
}
/**
 * Call this at each steps of your progress and change the step value
 * @param {Number} step Number of "char" to output
 * @param {String} char Default: '.'
 * @param {String} msg String before char. Final output will be `${str}${char.repeat(step)}`
 */
function cliProgressBar(step, char = '.', msg = `\x1b[2mⓘ Waiting response`) {
    if (isset(process) && isset(process.stdout) && isset(process.stdout.clearLine)) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${msg}${char.repeat(step)}\x1b[0m`); // \x1b[0m == reset color
    }
}
exports.cliProgressBar = cliProgressBar;
/** This allow an intuitive inline loading spinner with a check mark when loading as finished or a red cross for errors  */
class cliLoadingSpinner {
    constructor(type = 'dots', activeProcess = process) {
        const anims = {
            arrow: {
                interval: 120,
                frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸']
            },
            dots: {
                interval: 80,
                frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
            }
        };
        this.frameRate = anims[type].interval;
        this.animFrames = anims[type].frames;
        this.activeProcess = activeProcess;
    }
    start(msg) {
        this.frameNb = 0;
        this.progressMessage = msg;
        this.interval = setInterval(() => {
            this.activeProcess.stdout.clearLine();
            this.activeProcess.stdout.cursorTo(0);
            const symbol = this.animFrames[this.frameNb++ % this.animFrames.length];
            this.activeProcess.stdout.write(C.primary(symbol) + ' ' + this.progressMessage);
        }, this.frameRate);
    }
    end(error = false) {
        clearInterval(this.interval);
        this.activeProcess.stdout.clearLine();
        this.activeProcess.stdout.cursorTo(0);
        this.activeProcess.stdout.write(error ? C.red('✘ ' + this.progressMessage + '\n\n')
            : '\x1b[32m✓ ' + this.progressMessage + '\n\n');
        this.progressMessage = '';
    }
    error() {
        return this.end(true);
    }
}
exports.cliLoadingSpinner = cliLoadingSpinner;
//----------------------------------------
// STRING UTILS
//----------------------------------------
/** Remove accentued character from string and eventually special chars and numbers
 * @param {String} str input string
 * @param {Object} config { removeSpecialChars: false, removeNumbers: false, removeSpaces: false }
 * @returns String with all accentued char replaced by their non accentued version + config formattting
 */
function convertAccentedCharacters(str, config = {}) {
    let output = str
        .replace(/[àáâãäå]/g, 'a')
        .replace(/ç/g, 'c')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùúû]/g, 'u')
        .replace(/(^\s*|\s*$)/g, '');
    if (config.removeNumbers === true)
        output = output.replace(/\d+/g, '');
    if (config.removeSpecialChars === true)
        output = output.replace(/[^A-Za-z0-9 ]/g, '');
    if (config.removeSpaces === true)
        output = output.replace(/\s+/g, '');
    return output;
}
exports.convertAccentedCharacters = convertAccentedCharacters;
//----------------------------------------
// MONGO UTILS
//----------------------------------------
/** Merge filter with correct handling of OR and AND
 * @param {Object} filterA
 * @param {Object} filterB
 * @param {Boolean} assignToFilterA defualt false: if true, it will modify filterA, else it will return merged filters as a new object
 */
function mongoFilterMerger(filterA, filterB, assignToFilterA = false) {
    if (isset(filterA.$and) && isset(filterB.$and)) {
        filterA.$and.push(...filterB.$and);
        delete filterB.$and;
    }
    if (isset(filterA.$or) && isset(filterB.$or)) {
        if (!isset(filterA.$and))
            filterA.$and = [];
        filterA.$and.push({ $or: filterA.$or }, { $or: filterA.$or });
        delete filterB.$or;
    }
    if (assignToFilterA) {
        Object.assign(filterA, filterB);
        return filterA;
    }
    else
        return { ...filterA, ...filterB };
}
exports.mongoFilterMerger = mongoFilterMerger;
function mongoPush(field, value, fields) {
    if (!isset(fields.$push))
        fields.$push = {};
    fields.$push[field] = value;
}
exports.mongoPush = mongoPush;
//----------------------------------------
// TIMEOUT UTILS
//----------------------------------------
async function timeout(ms, fn = () => { }) { return new Promise(res => setTimeout(res, ms)).then(fn); }
exports.timeout = timeout;
async function runAsync(callback, milliseconds$ = 1) { return timeout(milliseconds$, callback); }
exports.runAsync = runAsync;
/**
 *
 * @param {Function} callback function that shall return ===true asynchronously
 * @param {Number} timeoutSec default:10; general timeout in seconds
 * @param {Boolean|String} errorAfterNSeconds default:true output an error in case of timeout, can be the displayed error message
 * @param {*} cliOutput write a cli progress to show that a process is running
 */
async function waitUntilTrue(callback, timeoutSec = 10, errorAfterNSeconds = true, cliOutput = true) {
    let generalTimeout = true;
    let step = 3;
    const errMess = typeof errorAfterNSeconds === 'string' ? 'Timeout: ' + errorAfterNSeconds : 'Timeout for waitUntilTrue() callback';
    if (timeoutSec)
        setTimeout(() => generalTimeout = false, timeoutSec * 1000);
    while (callback() !== true && generalTimeout) {
        if (cliOutput)
            cliProgressBar(step++);
        await timeout(300);
    }
    if (cliOutput)
        process.stdout.write(`\n`);
    if (!generalTimeout && errorAfterNSeconds)
        throw new dataValidationUtilErrorHandler(errMess, 500);
}
exports.waitUntilTrue = waitUntilTrue;
const delayedLoopParams = [];
let isExecuting = false;
/** Allow to perform an action in a delayed loop, useful for example to avoid reaching limits on servers. This function can be securely called multiple times.
 * @param {Function} callback
 * @param {Number} time default: 500ms;
 * @param {Function} errorCallback default: e => C.error(e)
 */
async function executeInDelayedLoop(callback, time = 500, errorCallback = e => C.error(e)) {
    delayedLoopParams.push([callback, time, errorCallback]);
    if (isExecuting)
        return;
    isExecuting = true;
    while (delayedLoopParams.length) {
        const [callback, time, errorCallback] = delayedLoopParams.shift();
        try {
            await callback();
            await timeout(time);
        }
        catch (err) {
            errorCallback(err);
        }
    }
    isExecuting = false;
}
exports.executeInDelayedLoop = executeInDelayedLoop;
//----------------------------------------
// TRANSACTION
//----------------------------------------
const transactionRunning = { __default: false };
const queue = { __default: [] };
/** Allow to perform async functions in a defined order
 * This adds the callback to a queue and is resolved when ALL previous callbacks with same name are executed
 * Use it like: await transaction('nameOfTheFlow', async () => { ...myFunction })
 * @param {String|Function} name name for the actions that should never happen concurrently
 * @param {Function} asyncCallback
 * @param {Number} timeout default: 120000 (120s) will throw an error if transaction time is higher that this amount of ms
 * @returns {Promise}
 */
async function transaction(name, asyncCallback, timeout = 120000, doNotThrow = false) {
    if (typeof name === 'function') {
        asyncCallback = name;
        name = '__default';
    }
    if (!isset(queue[name]))
        queue[name] = [];
    if (!isset(transactionRunning[name]))
        transactionRunning[name] = false;
    return await new Promise((resolve, reject) => {
        if (doNotThrow)
            reject = C.error;
        queue[name].push(async () => {
            try {
                setTimeout(() => {
                    C.warning('Transaction Timout'); // in case not catched
                    reject(new Error('transactionTimeout'));
                }, timeout);
                const res = await asyncCallback();
                resolve(res);
            }
            catch (err) {
                reject(err);
            }
        });
        removeItemFromQueue(name);
    });
}
exports.transaction = transaction;
async function removeItemFromQueue(name) {
    if (transactionRunning[name] === true)
        return; //       v 
    transactionRunning[name] = true; //               A  A       /\
    while (queue[name].length)
        await queue[name].shift()(); //   II
    transactionRunning[name] = false; //              \==/_______II
} //                                                    l  v_v_v _I
//                                                       11    11
/** Wait for a transaction to complete without creating a new transaction
 *
 */
async function waitForTransaction(transactionName, forceReleaseInSeconds = 30) {
    let brk = false;
    setTimeout(() => brk = true, forceReleaseInSeconds * 1000);
    while (isset(transactionRunning[transactionName]) && transactionRunning[transactionName] === true) {
        if (brk)
            break;
        await timeout(15);
    }
}
exports.waitForTransaction = waitForTransaction;
const _ = {
    round,
    random,
    cln,
    pad,
    // ALIASES
    int,
    minMax,
    generateToken,
    moyenne,
    average,
    sumArray,
    sortUrlsByDeepnessInArrayOrObject,
    urlPathJoin,
    miniTemplater,
    generateObjectId,
    isBetween,
    simpleObjectMaskOrSelect,
    ENV,
    parseBool,
    registerConfig,
    configFn,
    findByAddress,
    objForceWrite,
    objForceWriteIfNotSet,
    strAsArray,
    asArray,
    compareArrays,
    getArrayInCommon,
    getArrayDiff,
    getNotInArrayA,
    noDuplicateFilter,
    arrayCount,
    arrayToObjectSorted,
    pushIfNotExist,
    isNotEmptyArray,
    randomItemInArray,
    //allias
    arrayUniqueValue,
    deepClone,
    cloneObject,
    JSONstringyParse,
    has,
    isObject,
    mergeDeep,
    flattenObject,
    unflattenObject,
    recursiveGenericFunction,
    recursiveGenericFunctionSync,
    findByAddressAll,
    objFilterUndefined,
    readOnly,
    reassignForbidden,
    readOnlyForAll,
    mergeDeepOverrideArrays,
    mergeDeepConfigurable,
    objFilterUndefinedRecursive,
    removeUndefinedKeys,
    sortObjKeyAccordingToValue,
    ensureObjectProp,
    filterKeys,
    deleteByAddress,
    ensureIsArrayAndPush,
    removeCircularJSONstringify,
    isset,
    cleanStackTrace,
    shuffleArray,
    randomizeArray: shuffleArray,
    round2,
    camelCase,
    snakeCase,
    kebabCase,
    dashCase: kebabCase,
    underscoreCase: snakeCase,
    titleCase,
    pascalCase,
    lowerCase,
    upperCase,
    capitalize1st,
    camelCaseToWords,
    firstMatch,
    allMatches,
    getValuesBetweenSeparator,
    getValuesBetweenStrings,
    escapeRegexp,
    validator,
    required: validator,
    validatorReturnErrArray,
    assert,
    restTestMini,
    isValid,
    isType,
    isDateObject,
    issetOr,
    isEmptyOrNotSet,
    errIfNotSet,
    err500IfNotSet,
    errIfEmptyOrNotSet,
    err500IfEmptyOrNotSet,
    errXXXIfNotSet,
    isEmpty,
    checkAllObjectValuesAreEmpty,
    checkCtxIntegrity,
    // ALIASES
    orIsset: issetOr,
    // DATE
    getDateAsInt12,
    humanReadableTimestamp,
    getDateAsInt,
    getDateAsObject,
    isDateIntOrStringValid,
    isDateIsoOrObjectValid,
    dateStringToArray,
    dateArrayFormatted: dateArray,
    dateFormatted,
    dateSlash: dateFormatted,
    dateOffset,
    getTimeAsInt,
    getIntAsTime,
    isTimeStringValid,
    getDuration,
    doDateOverlap,
    getMonthAsInt,
    nextWeekDay,
    addMinutes,
    addHours,
    addDays,
    addMonths,
    addYears,
    getYear,
    getDayOfMonth,
    getHours,
    getMinutes,
    firstDayOfMonth,
    lastDayOfMonth,
    differenceInMilliseconds,
    differenceInSeconds,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    forI,
    forIasync,
    // ALIASES
    getDateAsArrayFormatted: dateArray,
    getDateAsArray: dateStringToArray,
    convertDateAsInt: getDateAsInt,
    convertDateAsObject: getDateAsObject,
    // LOGGER
    C,
    cliProgressBar,
    cliLoadingSpinner,
    outputLogs: logger,
    // STRING
    convertAccentedCharacters,
    // TIMEOUT
    executeInDelayedLoop,
    timeout,
    runAsync,
    waitUntilTrue,
    // TRANSACTION
    transaction,
    waitForTransaction,
    getId,
    mergeMixins,
    // MONGO
    mongoFilterMerger,
    mongoPush,
    tryCatch,
};
exports.default = _;
//# sourceMappingURL=utils.js.map