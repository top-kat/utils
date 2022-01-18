/// <reference types="node" />
declare const int: typeof parseInt;
declare const average: typeof moyenne;
declare const arrayUniqueValue: typeof noDuplicateFilter;
declare const JSONstringyParse: (o: any) => any;
declare const removeUndefinedKeys: typeof objFilterUndefinedRecursive;
declare type Color = [number, number, number];
declare type BaseTypes = 'objectId' | 'dateInt6' | 'dateInt' | 'dateInt8' | 'dateInt12' | 'time' | 'humanReadableTimestamp' | 'date' | 'dateObject' | 'array' | 'object' | 'buffer' | 'string' | 'function' | 'boolean' | 'number' | 'bigint' | 'year' | 'email';
/** Round with custom number of decimals (default:0) */
declare function round(number: number, decimals?: number): number;
/** Round with custom number of decimals (default:0) */
declare function round2(number: number, decimals?: number): number;
/** Is number between two numbers (including those numbers) */
declare function isBetween(number: number, min: number, max: number, inclusive?: boolean): boolean;
/** Random number between two values with 0 decimals by default */
declare function random(nb1: number, nb2: number, nbOfDecimals?: number): number;
/** Sum all values of an array, all values MUST be numbers */
declare function sumArray(array: number[]): number;
/** Moyenne / average between array of values
 * @param {Number} round number of decimals to keep. Default:2
*/
declare function moyenne(array: number[], nbOfDecimals?: number): number;
/** Clean output for outside world. All undefined / null / NaN / Infinity values are changed to '-' */
declare function cln(val: any, replacerInCaseItIsUndefinNaN?: string): any;
/** length default 2, shortcut for 1 to 01 */
declare function pad(numberOrStr: any, length?: number): string;
/** return the number or the closest number of the range
 * * nb min max  => returns
 * * 7  5   10   => 7 // in the range
 * * 2  5   10   => 5 // below the min value
 * * 99 5   10   => 10// above the max value
 */
declare function minMax(nb: number, min: number, max: number): number;
declare function tryCatch(callback: any, onErr?: Function): Promise<any>;
/** minLength 8 if unique
* @param {Number} length default: 20
* @param {Boolean} unique default: true. Generate a real unique token base on the date. min length will be min 8 in this case
* @param {string} mode one of ['alphanumeric', 'hexadecimal']
* NOTE: to generate a mongoDB Random Id, use the params: 24, true, 'hexadecimal'
*/
declare function generateToken(length?: number, unique?: boolean, mode?: string): any;
/** Useful to join differents bits of url with normalizing slashes
 * * urlPathJoin('https://', 'www.kikou.lol/', '/user', '//2//') => https://www.kikou.lol/user/2/
 * * urlPathJoin('http:/', 'kikou.lol') => https://www.kikou.lol
 */
declare function urlPathJoin(...bits: any[]): string;
/** path shall always be sorted before using in express
 *  to avoid a generic route like /* to catch a specific one like /bonjour
 *
 * @param {Object[]} urlObjOrArr
 * @param {String} propInObjectOrIndexInArray
 * @return {Array} urls modified
 */
declare function sortUrlsByDeepnessInArrayOrObject(urlObjOrArr: any, propInObjectOrIndexInArray: any): any;
/**
 * Replace variables in a string like: `Hello {{userName}}!`
 * @param {String} content
 * @param {Object} varz object with key => value === toReplace => replacer
 * @param {Object} options
 * * valueWhenNotSet => replacer for undefined values. Default: ''
 * * regexp          => must be 'g' and first capturing group matching the value to replace. Default: /{{\s*([^}]*)\s*}}/g
 */
declare function miniTemplater(content: any, varz: any, options: any): any;
/**
 *
 * @param {Object} object main object
 * @param {String[]} maskedOrSelectedFields array of fields
 * @param {Boolean} isMask default: true; determine the behavior of the function. If is mask, selected fields will not appear in the resulting object. If it's a select, only selected fields will appear.
 * @param {Boolean} deleteKeysInsteadOfReturningAnewObject default:false; modify the existing object instead of creating a new instance
 */
declare function simpleObjectMaskOrSelect(object: any, maskedOrSelectedFields: any, isMask?: boolean, deleteKeysInsteadOfReturningAnewObject?: boolean): any;
/** READ ONLY, output a parsed version of process.env
 * use it like ENV().myVar
 */
declare function ENV(): {
    [key: string]: any;
};
/**
 * @param {any} mayBeAstring
 * @return !!value
 */
declare function parseBool(mayBeAstring: string | boolean): boolean;
declare type Config = {
    env: string;
    isProd: boolean;
    nbOfLogsToKeep: number;
    customTypes: object;
    preprocessLog?: Function;
    terminal: {
        noColor: boolean;
        theme: {
            primary: Color;
            shade1: Color;
            shade2: Color;
            bgColor?: Color;
            paddingX: number;
            paddingY: number;
            fontColor?: Color;
            pageWidth: number;
            debugModeColor: Color;
        };
    };
};
/** Allow dynamic changing of config */
declare function configFn(): Config;
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
declare function registerConfig(customConfig: any): void;
/**
 * check if **object OR array** has property Safely (avoid cannot read property x of null and such)
 * @param {Object} obj object to test against
 * @param {string} addr `a.b.c.0.1` will test if myObject has props a that has prop b. Work wit arrays as well (like `arr.0`)
 */
declare function has(obj: object, addr: string): boolean;
/** Find address in an object "a.b.c" IN { a : { b : {c : 'blah' }}} RETURNS 'blah'
 * @param {object} obj
 * @param {string} addr accept syntax like "obj.subItem.[0].sub2" OR "obj.subItem.0.sub2" OR "obj.subItem[0].sub2"
 * @returns {any} the last item of the chain OR undefined if not found
 */
declare function findByAddress(obj: object, addr: string): any;
/** Enforce writing subItems. Eg: user.name.blah will ensure all are set until the writing of the last item
 * NOTE: doesn't work with arrays
 */
declare function objForceWrite(obj: object, addr: string, item: any): void;
/** Enforce writing subItems, only if obj.addr is empty.
 * Eg: user.name.blah will ensure all are set until the writing of the last item
 * if user.name.blah has a value it will not change it.
 * NOTE: doesn't work with arrays
 */
declare function objForceWriteIfNotSet(obj: object, addr: string, item: any): void;
/** Merge mixins into class. Use it in the constructor like: mergeMixins(this, {myMixin: true}) */
declare function mergeMixins(that: any, ...mixins: any[]): void;
/** If a string is provided, return it as array else return the value */
declare function strAsArray(arrOrStr: any): any;
/** If not an array provided, return the array with the value
 * /!\ NOTE /!\ In case the value is null or undefined, it will return that value
 */
declare function asArray<T>(item: T | T[]): T[] | undefined;
/** Array comparison
 * @return {object} { inCommon, notInB, notInA }
 */
declare function compareArrays(arrayA?: any[], arrayB?: any[], compare?: (a: any, b: any) => boolean): {
    inCommon: any[];
    notInB: any[];
    notInA: any[];
};
/**
 * @return [] only elements that are both in arrayA and arrayB
 */
declare function getArrayInCommon(arrayA?: any[], arrayB?: any[], compare?: (a: any, b: any) => boolean): any[];
/**
 * @return [] only elements that are in arrayB and not in arrayA
 */
declare function getNotInArrayA(arrayA?: any[], arrayB?: any[], compare?: (a: any, b: any) => boolean): any[];
/**
 * @return [] only elements that are in neither arrayA and arrayB
 */
declare function getArrayDiff(arrayA?: any[], arrayB?: any[], compare?: (a: any, b: any) => boolean): any[];
/** filter duplicate values in an array
 * @param {function} comparisonFn default:(a, b) => a === b. A function that shall return true if two values are considered equal
 * @return {array|function}
 */
declare function noDuplicateFilter(arr: any, comparisonFn?: (a: any, b: any) => boolean): any[];
/** Count number of occurence of item in array */
declare function arrayCount(item: any, arr: any[]): number;
/**
 * Sort an array in an object of subArrays, no duplicate.
 * @param {Array} array
 * @param {function} getFieldFromItem (itemOfArray) => field[String|Number]
 * tell me how you want to sort your Array
 */
declare function arrayToObjectSorted(array: any, getFieldFromItem: any): {};
/**
 * @param {Function} comparisonFunction default: (itemToPush, itemAlreadyInArray) => itemToPush === itemAlreadyInArray; comparison function to consider the added item duplicate
 */
declare function pushIfNotExist(arrayToPushInto: any, valueOrArrayOfValuesToBePushed: any, comparisonFunction?: (a: any, b: any) => boolean): any[];
declare function isNotEmptyArray(arr: any): boolean;
declare function randomItemInArray<T>(array: T[]): T;
declare function cloneObject(o: any): any;
/** Deep clone. WILL REMOVE circular references */
declare function deepClone(obj: any, cache?: any[]): any;
/** test if object but not array and not null (null is an object in Js) */
declare function isObject(o: any): boolean;
/** object and array merge
 * @warn /!\ Array will be merged and duplicate values will be deleted /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified*/
declare function mergeDeep(...objects: any[]): any;
/** object and array merge
 * @warn /!\ Array will be replaced by the latest object /!\
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified */
declare function mergeDeepOverrideArrays(...objects: any[]): any;
/** object and array merge
 * @param {Function} replacerForArrays item[key] = (prevValue, currentVal) => () When 2 values are arrays,
 * @param {Function} replacerForObjects item[key] = (prevValue, currentVal) => () When 2 values are objects,
 * @param {Function} replacerDefault item[key] = (prevValue, currentVal) => () For all other values
 * @param  {...Object} objects
 * @return {Object} new object result from merge
 * NOTE: objects in params will NOT be modified
 */
declare function mergeDeepConfigurable(replacerForArrays: (prev: any, curr: any) => any, replacerForObjects: any, replacerDefault?: (prev: any, curr: any) => any, ...objects: any[]): any;
/** { a: {b:2}} => {'a.b':2} useful for translations
 * NOTE: will remove circular references
 */
declare function flattenObject(data: any, config?: {
    withoutArraySyntax?: boolean;
    withArraySyntaxMinified?: boolean;
}): {};
/** {'a.b':2} => { a: {b:2}} */
declare function unflattenObject(data: any): {};
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
declare function recursiveGenericFunction(item: any, callback: any, addr$?: string, lastElementKey?: string, parent?: any, techFieldToAvoidCircularDependency?: any[]): Promise<any>;
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
declare function recursiveGenericFunctionSync(item: any, callback: any, addr$?: string, lastElementKey?: string, parent?: any, techFieldToAvoidCircularDependency?: any[]): any;
/** Remove all key/values pair if value is undefined  */
declare function objFilterUndefined(o: any): any;
/** Lock all 1st level props of an object to read only */
declare function readOnly(o: any): any;
/** Fields of the object can be created BUT NOT reassignated */
declare function reassignForbidden(o: any): any;
/** All fileds and subFields of the object will become readOnly */
declare function readOnlyForAll(object: any): any;
declare function objFilterUndefinedRecursive(obj: any): any;
/** Will return all objects matching that path. Eg: user.*.myVar */
declare function findByAddressAll(obj: any, addr: any): any;
declare function sortObjKeyAccordingToValue(unorderedObj: any, ascending?: boolean): {};
/**
 * Make default value if object key do not exist
 * @param {object} obj
 * @param {string} addr
 * @param {any} defaultValue
 * @param {function} callback (obj[addr]) => processValue. Eg: myObjAddr => myObjAddr.push('bikou')
 * @return obj[addr] eventually processed by the callback
 */
declare function ensureObjectProp(obj: object, addr: string, defaultValue: any, callback?: (o: any) => any): any;
/**
 * Maye sure obj[addr] is an array and push a value to it
 * @param {Object} obj parent object
 * @param {String} addr field name in parent
 * @param {Any} valToPush
 * @param {Boolean} onlyUniqueValues default:false; may be true or a comparision function; (a,b) => return true if they are the same like (a, b) => a.name === b.name
 * @return obj[addr] eventually processed by the callback
 */
declare function ensureIsArrayAndPush(obj: object, addr: string, valToPush: any, onlyUniqueValues: Function): any;
/**
 * @param {Object} obj the object on which we want to filter the keys
 * @param {function} filterFunc function that returns true if the key match the wanted criteria
 */
declare function filterKeys(obj: object, filter: any): any;
/**
 * @param {Object} obj the object on which we want to delete a property
 * @param {Array} addr addressArray on which to delete the property
 */
declare function deleteByAddress(obj: object, addr: string): void;
/** @return undefined if cannot find _id */
declare function getId(obj?: any): string;
declare function cleanStackTrace(stack: any): string;
declare function isset(...elms: any[]): boolean;
declare function removeCircularJSONstringify(object: any, indent?: number): string;
declare function shuffleArray(array: any): any;
/**Eg: camelCase */
declare function camelCase(...wordBits: any[]): string;
/**Eg: snake_case
 * trimmed but not lowerCased
 */
declare function snakeCase(...wordBits: any[]): string;
/**Eg: kebab-case
 * trimmed AND lowerCased
 * undefined, null... => ''
 */
declare function kebabCase(...wordBits: any[]): string;
/**Eg: PascalCase undefined, null... => '' */
declare function pascalCase(...wordBits: any[]): string;
/**Eg: Titlecase undefined, null... => '' */
declare function titleCase(...wordBits: any[]): string;
/**Eg: UPPERCASE undefined, null... => '' */
declare function upperCase(...wordBits: any[]): string;
/**Eg: lowercase undefined, null... => '' */
declare function lowerCase(...wordBits: any[]): string;
declare function capitalize1st(str?: string): string;
declare function camelCaseToWords(str: any): any;
declare function escapeRegexp(str: string, config?: {
    parseStarChar?: boolean;
}): string;
/** Get first match of the first capturing group of regexp
 * Eg: const basePath = firstMatch(apiFile, /basePath = '(.*?)'/); will get what is inside quotes
 */
declare function firstMatch(str: string, regExp: RegExp): string | undefined;
/** Get all matches from regexp with g flag
 * Eg: [ [full, match1, m2], [f, m1, m2]... ]
 * NOTE: the G flag will be appended to regexp
 */
declare function allMatches(str: string, reg: RegExp): string[];
/** GIVEN A STRING '{ blah;2}, ['nested,(what,ever)']' AND A SEPARATOR ",""
 *  This will return the content separated by first level of separators
 *  @return ["{ blah;2}", "['nested,(what,ever)']"]
 */
declare function getValuesBetweenSeparator(str: string, separator: string, removeTrailingSpaces?: boolean): any;
/** GIVEN A STRING "a: [ 'str', /[^]]/, '[aa]]]str', () => [ nestedArray ] ], b: ['arr']"
 * @return matching: [ "'str', /[^]]/, '[aa]]]str', () => [ nestedArray ]", "'arr'" ], between: [ "a:", ", b: " ]
 * @param str base string
 * @param openingOrSeparator opening character OR separator if closing not set
 * @param closing
 * @param ignoreBetweenOpen default ['\'', '`', '"', '/'], when reaching an opening char, it will ignore all until it find the corresponding closing char
 * @param ignoreBetweenClose default ['\'', '`', '"', '/'] list of corresponding closing chars
 */
declare function getValuesBetweenStrings(str: string, openingOrSeparator: any, closing: any, ignoreBetweenOpen?: string[], ignoreBetweenClose?: string[], removeTrailingSpaces?: boolean): {
    inner: any;
    outer: any;
};
declare function issetOr(...elms: any[]): boolean;
declare function isEmptyOrNotSet(...elms: any[]): boolean;
declare function errIfNotSet(objOfVarNamesWithValues: any, additionalMessage: any): void;
declare function err500IfNotSet(objOfVarNamesWithValues: any): void;
declare function errIfEmptyOrNotSet(objOfVarNamesWithValues: any): void;
declare function err500IfEmptyOrNotSet(objOfVarNamesWithValues: any): void;
declare function errXXXIfNotSet(errCode: any, checkEmpty: any, objOfVarNamesWithValues: any): void;
declare function isDateObject(variable: any): boolean;
/** Check all values are set */
declare function checkAllObjectValuesAreEmpty(o: any): boolean;
/** Throw an error in case data passed is not a valid ctx */
declare function checkCtxIntegrity(ctx: any): void;
/**
## VALIDATOR

@name validator

@description support multiple names, multiple values and multiple type check
@option if nameString ends by $ sign it is considered optional

@function validator([Objects])
@return {error|true/false|testMode} depend on mode (see prop mode)
@param {} mode normal (default) | test (TODO) | boolean
@param {} name 'myName' || [{myVar1: 'blah, myvar2: myvar2}], support multiple names / values
@param {} value myVar,
@param {string} myVar myVar, instead of name / value
@param {array} in ['blah', 'otherPossibleValue', true], equal ONE OF THESE values
@param {any} eq exactly equal to in, both support string or array of values
@param {any} neq not in, both support string or array of values
@param {number} lte 3, less than or equal
@param {number} gte 1, greater or equal
@param {number} lt 3, less than
@param {number} gt 1, greater
@param {string|string[]} type
 * possibleTypes: object, number, string, boolean, array, date, dateInt8, dateInt12, dateInt6, time, objectId (mongo), humanReadableTimestamp, buffer
 * Notes: multiples value is an OR, /!\ Array is type 'array' and not 'object' like in real JS /!\
@param {regExp} regexp /regexp/, test against regexp
@param {number} minLength for string, array or number length
@param {number} maxLength
@param {number} length
@param {boolean} optional default false
@param {boolean} emptyAllowed default false (to use if must be set but can be empty)
@param {boolean} mustNotBeSet this one must not be set
@param {any} includes check if array or string includes value (like js .includes())

@example
    validator(
        { myNumber : 3, type: 'number', gte: 1, lte: 3 }, // use the name directly as a param
        { name: 'email', value: 'nameATsite.com', regexp: /[^\sAT]+AT[^\sAT]+\.[^\sAT]/},
        { name: [{'blahVar': blahVarValue, 'myOtherVar': myOtherVarValue}], type: 'string'} // multiple names for same check
    )
----------------------------------------*/
declare type ValidatorObject = {
    name?: string;
    value?: any;
    type?: BaseTypes;
    eq?: any;
    neq?: any;
    in?: any[];
    lt?: number;
    gt?: number;
    lte?: number;
    gte?: number;
    length?: number;
    minLength?: number;
    maxLength?: number;
    emptyAllowed?: boolean;
    regexp?: RegExp;
    mustNotBeSet?: boolean;
    optional?: boolean;
    [k: string]: any;
};
declare function validator(...paramsToValidate: ValidatorObject[]): void;
declare const restTestMini: {
    reset(): void;
    printStats(): void;
    nbSuccess: number;
    nbError: number;
    lastErrors: any[];
};
declare function assert(msg: string, value: any, validatorObject?: ValidatorObject | number | boolean | string): void;
/** Same as validator but return a boolean
 * See {@link validator}
 */
declare function isValid(...paramsToValidate: any[]): boolean;
/** Default types + custom types
 * 'objectId','dateInt6','dateInt','dateInt8','dateInt12','time','humanReadableTimestamp','date','array','object','buffer','string','function','boolean','number','bigint',
 */
declare function isType(value: any, type: BaseTypes): boolean;
declare function validatorReturnErrArray(...paramsToValidate: ValidatorObject[]): [string?, number?, object?];
declare function isEmpty(objOrArr: object | any[] | string | null | undefined): boolean;
declare function getDateAsInt12(dateAllFormat?: Date | string | number, errIfNotValid?: any): number;
declare function humanReadableTimestamp(dateAllFormat: any): number;
/** format for 6/8/2018 => 20180806
 * @param dateAllFormat multiple format allowed 2012, 20120101, 201201011200, new Date(), "2019-12-08T16:19:10.341Z" and all string that new Date() can parse
 */
declare function getDateAsInt(dateAllFormat?: Date | string | number, errIfNotValid$?: boolean, withHoursAndMinutes$?: boolean): number;
declare function getMonthAsInt(dateAllFormat?: Date | string | number): number;
/**
 * @param dateAllFormat multiple format allowed 2012, 20120101, 201201011200, new Date(), "2019-12-08T16:19:10.341Z" and all string that new Date() can parse
 */
declare function getDateAsObject(dateAllFormat?: any, errIfNotValid$?: boolean): Date;
declare function isDateIntOrStringValid(dateStringOrInt: any, outputAnError?: boolean, length?: any): boolean;
declare function isDateIsoOrObjectValid(dateIsoOrObj: any, outputAnError?: boolean): boolean;
/** [2018,01,06] */
declare function dateStringToArray(strOrInt: any): any[];
/**
 * @param dateAllFormat default: actualDate
 * @returns ['01', '01', '2019'] OR **string** if separator is provided */
declare function dateArray(dateAllFormat?: Date | string | number): [string, string, string];
/**
 * @param dateAllFormat default: actualDate
 * @returns ['01', '01', '2019'] OR **string** if separator is provided */
declare function dateArrayInt(dateAllFormat?: Date | string | number): [number, number, number];
/**
 * @return 01/01/2012 (alias of dateArrayFormatted(date, '/'))
 */
declare function dateFormatted(dateAllFormat: Date | string | number, separator?: string): string;
/** Date with custom offset (Ex: +2 for France) */
declare function dateOffset(offsetHours: any, dateObj?: Date): Date;
/**  */
declare function getTimeAsInt(timeOrDateInt?: any): number | "dateInvalid";
/**
 * @param {timeInt|dateInt12} Eg: 2222 OR 201201012222. Default, actual dateInt12
 * @param {String} separator default: ":"
 */
declare function getIntAsTime(intOrDateTimeInt?: number, separator?: string): string;
declare function isTimeStringValid(timeStr: any, outputAnError$?: boolean): boolean;
declare function getDuration(startDate: any, endDate: any, inMinutes?: boolean): number | number[];
/** compare two object with DATE INT, if they overlap return true
 * @param {Object} event1 {startDate, endDate}
 * @param {Object} event2 {startDate, endDate}
 * @param {String} fieldNameForStartDate$ replace startDate with this string
 * @param {String} fieldNameForEndDate$ replace endDate with this string
 * @param {Boolean} allowNull$ if false, retrun false if any of the startdates or enddates are not set
 * @param {Boolean} strict$ if true,
 */
declare function doDateOverlap(event1: any, event2: any, fieldNameForStartDate$?: string, fieldNameForEndDate$?: string, allowNull$?: boolean, strict$?: boolean): boolean;
/** Get all dates at specified days between two dates
 * @param daysArray [0,1,2,3,4,5,6]
 * @param {*} startDate all format
 * @param {*} endDate all format
 * @param {'int'|'object'} outputFormat default: int
 */
declare function getDatesForDaysArrayBetweenTwoDates(daysArray: any, startDate: any, endDate: any, outputFormat?: string): (number | Date)[];
declare function getEndTimeFromDurationAndStartTime(startTime: any, duration: any): {
    days: number;
    time: string;
};
declare function getDate12FromDateAndTime(dateAllFormat: Date | string | number, timeAllFormat: any): any;
declare function eachDayOfInterval(startDateAllFormat: any, endDateAllFormat: any, outputFormat?: string): (number | Date)[];
declare function eachMonthOfInterval(startDateAllFormat: any, endDateAllFormat: any): any[];
declare function isSunday(dateAllFormat?: Date | string | number): boolean;
declare function isMonday(dateAllFormat?: Date | string | number): boolean;
declare function isTuesday(dateAllFormat?: Date | string | number): boolean;
declare function isWednesday(dateAllFormat?: Date | string | number): boolean;
declare function isThursday(dateAllFormat?: Date | string | number): boolean;
declare function isFriday(dateAllFormat?: Date | string | number): boolean;
declare function isSaturday(dateAllFormat?: Date | string | number): boolean;
declare function isWeekend(dateAllFormat?: Date | string | number): boolean;
declare function nextWeekDay(fromDate: any, weekDayInt?: 0 | 1 | 2 | 3 | 4 | 5 | 6, outputFormat?: 'dateInt8' | 'dateInt12' | 'humanReadableTimestamp', sameDayAllowed?: boolean): number;
declare function nextWeekDay(fromDate: any, weekDayInt?: 0 | 1 | 2 | 3 | 4 | 5 | 6, outputFormat?: 'date', sameDayAllowed?: boolean): Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function addDays(dateAllFormat?: Date | string | number, numberOfDays?: number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function addMinutes(dateAllFormat?: Date | string | number, numberOfMinutes?: number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function addHours(dateAllFormat?: Date | string | number, numberOfHours?: number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function addMonths(dateAllFormat?: Date | string | number, numberOfMonths?: number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function addYears(dateAllFormat?: Date | string | number, numberOfYears?: number, outputFormat?: string): number | Date;
declare function getDayOfMonth(dateAllFormat?: Date | string | number): any;
declare function getYear(dateAllFormat?: Date | string | number): any;
declare function getHours(dateAllFormat?: Date | string | number): any;
declare function getMinutes(dateAllFormat?: Date | string | number): any;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function lastDayOfMonth(dateAllFormat?: Date | string | number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function firstDayOfMonth(dateAllFormat?: Date | string | number, outputFormat?: string): number | Date;
declare function differenceInMilliseconds(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInSeconds(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInMinutes(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInHours(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInDays(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInWeeks(startDateAllFormat: any, endDateAllFormat: any): number;
declare function differenceInMonths(startDateAllFormat: any, endDateAllFormat: any): number;
/** Will check if that date exists, and if not, this will
 * Usefull for monthly subscription or reccuring month dates
 * @param {any} dateAllFormat default: new Date()
 * @returns {Date} Date object
 */
declare function getClosestExistingDateOfMonth(dateAllFormat?: Date | string | number): any;
/** Compute the best possible date for next month same day
 * Usefull for monthly subscription or reccuring month dates
 * @param {any} dateAllFormat default: new Date()
 * @param {Boolean} onlyFuture if true return the future date relative to any date in the past, else, it return the next month date possible relative to the dateAllFormat
 * @returns {Date} Date object
 */
declare function getNextMonthlyDate(dateAllFormat?: Date | string | number, onlyFuture?: boolean): any;
declare function getHolidayReferenceYear(dateAllFormat: Date | string | number): number;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function getFirstDayOfHolidayReferenceYear(dateAllFormat: Date | string | number, outputFormat?: string): number | Date;
/**
 * @param {String} outputFormat dateInt, dateInt8, dateInt12, date, humanReadableTimestamp, int (dateInt8)
 */
declare function getLastDayOfHolidayReferenceYear(dateAllFormat: Date | string | number, outputFormat?: string): number | Date;
/**
// console colored output
// * console.log(C.green(C.dim('Hey bro !')))
// * or C.log() // will use padding and color defined by themes
// * or C.line('MY TITLE', 53)
// * or C.gradientize(myLongString)
*/
declare const C: {
    dim: (str: any) => string;
    green: (str: any) => string;
    red: (str: any) => string;
    yellow: (str: any) => string;
    grey: (str: any) => string;
    magenta: (str: any) => string;
    cyan: (str: any) => string;
    blue: (str: any) => string;
    primary: (str: any) => string;
    reset: string;
    output: (code: any, str?: string) => string;
    rgb: (r: any, g?: number, b?: number) => string;
    bg: (r?: any, g?: any, b?: any) => string;
    /** Output a line of title */
    line(title?: string, length?: number, clr?: Color, char?: string, paddingX?: number): void;
    /** Eg: ['cell1', 'cell2', 'cell3'], [25, 15] will start cell2 at 25 and cell 3 at 25 + 15
     * @param {Array} limits default divide the viewport
     */
    cols(strings: any, limits?: any[], clr?: Color, paddingX?: number): void;
    /** Console log alias */
    log(...stringsCtxMayBeFirstParam: any[]): void;
    logClr(str: any, clr?: Color, paddingX?: number): void;
    info(...str: any[]): void;
    success(...str: any[]): void;
    /** First param **false** to avoid logging stack trace */
    error: (...errors: any[]) => any;
    /** First param **false** to avoid logging stack trace */
    warning: (...str: any[]) => any;
    customError: (color: any, ...str: any[]) => any;
    customWarning: (color: any, ...str: any[]) => any;
    applicationError: (color: any, ...str: any[]) => any;
    warningLight: (color: any, ...str: any[]) => any;
    dimStrSplit(...logs: any[]): string;
    notifShow(): void;
    /** Keep in memory the logs to show when needed with C.notifShow()
     * Ex: C.notification('info', str); */
    notification(type: any, ...messages: any[]): void;
    notifications: any[];
    /** Gratientize lines of text (separated by \n) */
    gradientize(str?: string, rgb1?: Color, rgb2?: Color, bgRgb?: Color, paddingY?: number, paddingX?: number): void;
    debugModeLog(title: any, ...string: any[]): void;
    useTheme(): void;
};
/**
 * Call this at each steps of your progress and change the step value
 * @param {Number} step Number of "char" to output
 * @param {String} char Default: '.'
 * @param {String} msg String before char. Final output will be `${str}${char.repeat(step)}`
 */
declare function cliProgressBar(step: any, char?: string, msg?: string): void;
/** This allow an intuitive inline loading spinner with a check mark when loading as finished or a red cross for errors  */
declare class cliLoadingSpinner {
    /** Please use it like spinner.start('myStuff') then spinner.end()
     * @param {String} type in: ['arrow', 'dots']
     */
    frameRate: number;
    animFrames: string[];
    activeProcess: any;
    frameNb: number;
    progressMessage: string;
    interval: any;
    constructor(type?: string, activeProcess?: NodeJS.Process);
    start(msg: any): void;
    end(error?: boolean): void;
    error(): void;
}
/** Remove accentued character from string and eventually special chars and numbers
 * @param {String} str input string
 * @param {Object} config { removeSpecialChars: false, removeNumbers: false, removeSpaces: false }
 * @returns String with all accentued char replaced by their non accentued version + config formattting
 */
declare function convertAccentedCharacters(str: any, config?: {
    removeNumbers?: boolean;
    removeSpecialChars?: boolean;
    removeSpaces?: boolean;
}): any;
/** Merge filter with correct handling of OR and AND
 * @param {Object} filterA
 * @param {Object} filterB
 * @param {Boolean} assignToFilterA defualt false: if true, it will modify filterA, else it will return merged filters as a new object
 */
declare function mongoFilterMerger(filterA: any, filterB: any, assignToFilterA?: boolean): any;
declare function mongoPush(field: string, value: any, fields: {
    [k: string]: any;
}): void;
declare function timeout(ms: any, fn?: () => void): Promise<void>;
declare function runAsync(callback: any, milliseconds$?: number): Promise<void>;
/**
 *
 * @param {Function} callback function that shall return ===true asynchronously
 * @param {Number} timeoutSec default:10; general timeout in seconds
 * @param {Boolean|String} errorAfterNSeconds default:true output an error in case of timeout, can be the displayed error message
 * @param {*} cliOutput write a cli progress to show that a process is running
 */
declare function waitUntilTrue(callback: any, timeoutSec?: number, errorAfterNSeconds?: boolean, cliOutput?: boolean): Promise<void>;
/** Allow to perform an action in a delayed loop, useful for example to avoid reaching limits on servers. This function can be securely called multiple times.
 * @param {Function} callback
 * @param {Number} time default: 500ms;
 * @param {Function} errorCallback default: e => C.error(e)
 */
declare function executeInDelayedLoop(callback: any, time?: number, errorCallback?: (e: any) => any): Promise<void>;
/** Allow to perform async functions in a defined order
 * This adds the callback to a queue and is resolved when ALL previous callbacks with same name are executed
 * Use it like: await transaction('nameOfTheFlow', async () => { ...myFunction })
 * @param {String|Function} name name for the actions that should never happen concurrently
 * @param {Function} asyncCallback
 * @param {Number} timeout default: 120000 (120s) will throw an error if transaction time is higher that this amount of ms
 * @returns {Promise}
 */
declare function transaction(name: any, asyncCallback: any, timeout?: number, doNotThrow?: boolean): Promise<unknown>;
/** Wait for a transaction to complete without creating a new transaction
 *
 */
declare function waitForTransaction(transactionName: any, forceReleaseInSeconds?: number): Promise<void>;
declare const _: {
    round: typeof round;
    random: typeof random;
    cln: typeof cln;
    pad: typeof pad;
    int: typeof parseInt;
    minMax: typeof minMax;
    generateToken: typeof generateToken;
    moyenne: typeof moyenne;
    average: typeof moyenne;
    sumArray: typeof sumArray;
    sortUrlsByDeepnessInArrayOrObject: typeof sortUrlsByDeepnessInArrayOrObject;
    urlPathJoin: typeof urlPathJoin;
    miniTemplater: typeof miniTemplater;
    isBetween: typeof isBetween;
    simpleObjectMaskOrSelect: typeof simpleObjectMaskOrSelect;
    ENV: typeof ENV;
    parseBool: typeof parseBool;
    registerConfig: typeof registerConfig;
    configFn: typeof configFn;
    findByAddress: typeof findByAddress;
    objForceWrite: typeof objForceWrite;
    objForceWriteIfNotSet: typeof objForceWriteIfNotSet;
    strAsArray: typeof strAsArray;
    asArray: typeof asArray;
    compareArrays: typeof compareArrays;
    getArrayInCommon: typeof getArrayInCommon;
    getArrayDiff: typeof getArrayDiff;
    getNotInArrayA: typeof getNotInArrayA;
    noDuplicateFilter: typeof noDuplicateFilter;
    arrayCount: typeof arrayCount;
    arrayToObjectSorted: typeof arrayToObjectSorted;
    pushIfNotExist: typeof pushIfNotExist;
    isNotEmptyArray: typeof isNotEmptyArray;
    randomItemInArray: typeof randomItemInArray;
    arrayUniqueValue: typeof noDuplicateFilter;
    deepClone: typeof deepClone;
    cloneObject: typeof cloneObject;
    JSONstringyParse: (o: any) => any;
    has: typeof has;
    isObject: typeof isObject;
    mergeDeep: typeof mergeDeep;
    flattenObject: typeof flattenObject;
    unflattenObject: typeof unflattenObject;
    recursiveGenericFunction: typeof recursiveGenericFunction;
    recursiveGenericFunctionSync: typeof recursiveGenericFunctionSync;
    findByAddressAll: typeof findByAddressAll;
    objFilterUndefined: typeof objFilterUndefined;
    readOnly: typeof readOnly;
    reassignForbidden: typeof reassignForbidden;
    readOnlyForAll: typeof readOnlyForAll;
    mergeDeepOverrideArrays: typeof mergeDeepOverrideArrays;
    mergeDeepConfigurable: typeof mergeDeepConfigurable;
    objFilterUndefinedRecursive: typeof objFilterUndefinedRecursive;
    removeUndefinedKeys: typeof objFilterUndefinedRecursive;
    sortObjKeyAccordingToValue: typeof sortObjKeyAccordingToValue;
    ensureObjectProp: typeof ensureObjectProp;
    filterKeys: typeof filterKeys;
    deleteByAddress: typeof deleteByAddress;
    ensureIsArrayAndPush: typeof ensureIsArrayAndPush;
    removeCircularJSONstringify: typeof removeCircularJSONstringify;
    isset: typeof isset;
    cleanStackTrace: typeof cleanStackTrace;
    shuffleArray: typeof shuffleArray;
    randomizeArray: typeof shuffleArray;
    round2: typeof round2;
    camelCase: typeof camelCase;
    snakeCase: typeof snakeCase;
    kebabCase: typeof kebabCase;
    dashCase: typeof kebabCase;
    underscoreCase: typeof snakeCase;
    titleCase: typeof titleCase;
    pascalCase: typeof pascalCase;
    lowerCase: typeof lowerCase;
    upperCase: typeof upperCase;
    capitalize1st: typeof capitalize1st;
    camelCaseToWords: typeof camelCaseToWords;
    firstMatch: typeof firstMatch;
    allMatches: typeof allMatches;
    getValuesBetweenSeparator: typeof getValuesBetweenSeparator;
    getValuesBetweenStrings: typeof getValuesBetweenStrings;
    escapeRegexp: typeof escapeRegexp;
    validator: typeof validator;
    required: typeof validator;
    validatorReturnErrArray: typeof validatorReturnErrArray;
    assert: typeof assert;
    restTestMini: {
        reset(): void;
        printStats(): void;
        nbSuccess: number;
        nbError: number;
        lastErrors: any[];
    };
    isValid: typeof isValid;
    isType: typeof isType;
    isDateObject: typeof isDateObject;
    issetOr: typeof issetOr;
    isEmptyOrNotSet: typeof isEmptyOrNotSet;
    errIfNotSet: typeof errIfNotSet;
    err500IfNotSet: typeof err500IfNotSet;
    errIfEmptyOrNotSet: typeof errIfEmptyOrNotSet;
    err500IfEmptyOrNotSet: typeof err500IfEmptyOrNotSet;
    errXXXIfNotSet: typeof errXXXIfNotSet;
    isEmpty: typeof isEmpty;
    checkAllObjectValuesAreEmpty: typeof checkAllObjectValuesAreEmpty;
    checkCtxIntegrity: typeof checkCtxIntegrity;
    orIsset: typeof issetOr;
    getDateAsInt12: typeof getDateAsInt12;
    humanReadableTimestamp: typeof humanReadableTimestamp;
    getDateAsInt: typeof getDateAsInt;
    getDateAsObject: typeof getDateAsObject;
    isDateIntOrStringValid: typeof isDateIntOrStringValid;
    isDateIsoOrObjectValid: typeof isDateIsoOrObjectValid;
    dateStringToArray: typeof dateStringToArray;
    dateArrayFormatted: typeof dateArray;
    dateFormatted: typeof dateFormatted;
    dateSlash: typeof dateFormatted;
    dateOffset: typeof dateOffset;
    getTimeAsInt: typeof getTimeAsInt;
    getIntAsTime: typeof getIntAsTime;
    isTimeStringValid: typeof isTimeStringValid;
    getDuration: typeof getDuration;
    doDateOverlap: typeof doDateOverlap;
    getDatesForDaysArrayBetweenTwoDates: typeof getDatesForDaysArrayBetweenTwoDates;
    getEndTimeFromDurationAndStartTime: typeof getEndTimeFromDurationAndStartTime;
    getDate12FromDateAndTime: typeof getDate12FromDateAndTime;
    getMonthAsInt: typeof getMonthAsInt;
    isSunday: typeof isSunday;
    isMonday: typeof isMonday;
    isTuesday: typeof isTuesday;
    isWednesday: typeof isWednesday;
    isThursday: typeof isThursday;
    isFriday: typeof isFriday;
    isSaturday: typeof isSaturday;
    isWeekend: typeof isWeekend;
    nextWeekDay: typeof nextWeekDay;
    addMinutes: typeof addMinutes;
    addHours: typeof addHours;
    addDays: typeof addDays;
    addMonths: typeof addMonths;
    addYears: typeof addYears;
    getYear: typeof getYear;
    getDayOfMonth: typeof getDayOfMonth;
    getHours: typeof getHours;
    getMinutes: typeof getMinutes;
    firstDayOfMonth: typeof firstDayOfMonth;
    lastDayOfMonth: typeof lastDayOfMonth;
    eachDayOfInterval: typeof eachDayOfInterval;
    eachMonthOfInterval: typeof eachMonthOfInterval;
    differenceInMilliseconds: typeof differenceInMilliseconds;
    differenceInSeconds: typeof differenceInSeconds;
    differenceInMinutes: typeof differenceInMinutes;
    differenceInHours: typeof differenceInHours;
    differenceInDays: typeof differenceInDays;
    differenceInWeeks: typeof differenceInWeeks;
    differenceInMonths: typeof differenceInMonths;
    getClosestExistingDateOfMonth: typeof getClosestExistingDateOfMonth;
    getNextMonthlyDate: typeof getNextMonthlyDate;
    getHolidayReferenceYear: typeof getHolidayReferenceYear;
    getFirstDayOfHolidayReferenceYear: typeof getFirstDayOfHolidayReferenceYear;
    getLastDayOfHolidayReferenceYear: typeof getLastDayOfHolidayReferenceYear;
    getDateAsArrayFormatted: typeof dateArray;
    getDateAsArray: typeof dateStringToArray;
    convertDateAsInt: typeof getDateAsInt;
    convertDateAsObject: typeof getDateAsObject;
    C: {
        dim: (str: any) => string;
        green: (str: any) => string;
        red: (str: any) => string;
        yellow: (str: any) => string;
        grey: (str: any) => string;
        magenta: (str: any) => string;
        cyan: (str: any) => string;
        blue: (str: any) => string;
        primary: (str: any) => string;
        reset: string;
        output: (code: any, str?: string) => string;
        rgb: (r: any, g?: number, b?: number) => string;
        bg: (r?: any, g?: any, b?: any) => string;
        /** Output a line of title */
        line(title?: string, length?: number, clr?: Color, char?: string, paddingX?: number): void;
        /** Eg: ['cell1', 'cell2', 'cell3'], [25, 15] will start cell2 at 25 and cell 3 at 25 + 15
         * @param {Array} limits default divide the viewport
         */
        cols(strings: any, limits?: any[], clr?: Color, paddingX?: number): void;
        /** Console log alias */
        log(...stringsCtxMayBeFirstParam: any[]): void;
        logClr(str: any, clr?: Color, paddingX?: number): void;
        info(...str: any[]): void;
        success(...str: any[]): void;
        /** First param **false** to avoid logging stack trace */
        error: (...errors: any[]) => any;
        /** First param **false** to avoid logging stack trace */
        warning: (...str: any[]) => any;
        customError: (color: any, ...str: any[]) => any;
        customWarning: (color: any, ...str: any[]) => any;
        applicationError: (color: any, ...str: any[]) => any;
        warningLight: (color: any, ...str: any[]) => any;
        dimStrSplit(...logs: any[]): string;
        notifShow(): void;
        /** Keep in memory the logs to show when needed with C.notifShow()
         * Ex: C.notification('info', str); */
        notification(type: any, ...messages: any[]): void;
        notifications: any[];
        /** Gratientize lines of text (separated by \n) */
        gradientize(str?: string, rgb1?: Color, rgb2?: Color, bgRgb?: Color, paddingY?: number, paddingX?: number): void;
        debugModeLog(title: any, ...string: any[]): void;
        useTheme(): void;
    };
    cliProgressBar: typeof cliProgressBar;
    cliLoadingSpinner: typeof cliLoadingSpinner;
    outputLogs: any;
    convertAccentedCharacters: typeof convertAccentedCharacters;
    executeInDelayedLoop: typeof executeInDelayedLoop;
    timeout: typeof timeout;
    runAsync: typeof runAsync;
    waitUntilTrue: typeof waitUntilTrue;
    transaction: typeof transaction;
    waitForTransaction: typeof waitForTransaction;
    getId: typeof getId;
    mergeMixins: typeof mergeMixins;
    mongoFilterMerger: typeof mongoFilterMerger;
    mongoPush: typeof mongoPush;
    tryCatch: typeof tryCatch;
};
export default _;
export { round, random, cln, pad, int, minMax, generateToken, moyenne, average, sumArray, sortUrlsByDeepnessInArrayOrObject, urlPathJoin, miniTemplater, isBetween, simpleObjectMaskOrSelect, ENV, parseBool, registerConfig, configFn, findByAddress, objForceWrite, objForceWriteIfNotSet, strAsArray, asArray, compareArrays, getArrayInCommon, getArrayDiff, getNotInArrayA, noDuplicateFilter, arrayCount, arrayToObjectSorted, pushIfNotExist, isNotEmptyArray, randomItemInArray, arrayUniqueValue, deepClone, cloneObject, JSONstringyParse, has, isObject, mergeDeep, flattenObject, unflattenObject, recursiveGenericFunction, recursiveGenericFunctionSync, findByAddressAll, objFilterUndefined, readOnly, reassignForbidden, readOnlyForAll, mergeDeepOverrideArrays, mergeDeepConfigurable, objFilterUndefinedRecursive, removeUndefinedKeys, // alias
sortObjKeyAccordingToValue, ensureObjectProp, filterKeys, deleteByAddress, ensureIsArrayAndPush, removeCircularJSONstringify, isset, cleanStackTrace, shuffleArray, shuffleArray as randomizeArray, round2, camelCase, snakeCase, kebabCase, kebabCase as dashCase, snakeCase as underscoreCase, titleCase, pascalCase, lowerCase, upperCase, capitalize1st, camelCaseToWords, firstMatch, allMatches, getValuesBetweenSeparator, getValuesBetweenStrings, escapeRegexp, validator, validator as required, // alias for readability
validatorReturnErrArray, assert, restTestMini, isValid, isType, isDateObject, issetOr, isEmptyOrNotSet, errIfNotSet, err500IfNotSet, errIfEmptyOrNotSet, err500IfEmptyOrNotSet, errXXXIfNotSet, isEmpty, checkAllObjectValuesAreEmpty, checkCtxIntegrity, issetOr as orIsset, getDateAsInt12, humanReadableTimestamp, getDateAsInt, getDateAsObject, isDateIntOrStringValid, isDateIsoOrObjectValid, dateStringToArray, dateArray, dateArrayInt, dateFormatted as dateSlash, dateFormatted, dateOffset, getTimeAsInt, getIntAsTime, isTimeStringValid, getDuration, doDateOverlap, getDatesForDaysArrayBetweenTwoDates, getEndTimeFromDurationAndStartTime, getDate12FromDateAndTime, getMonthAsInt, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isWeekend, nextWeekDay, addMinutes, addHours, addDays, addMonths, addYears, getYear, getDayOfMonth, getHours, getMinutes, firstDayOfMonth, lastDayOfMonth, eachDayOfInterval, eachMonthOfInterval, differenceInMilliseconds, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths, getClosestExistingDateOfMonth, getNextMonthlyDate, getHolidayReferenceYear, getFirstDayOfHolidayReferenceYear, getLastDayOfHolidayReferenceYear, getDateAsInt as convertDateAsInt, getDateAsObject as convertDateAsObject, C, cliProgressBar, cliLoadingSpinner, convertAccentedCharacters, executeInDelayedLoop, timeout, runAsync, waitUntilTrue, transaction, waitForTransaction, getId, mergeMixins, mongoFilterMerger, mongoPush, tryCatch, };
