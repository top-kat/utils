# TOPKAT-UTILS

Here are my utils for nodeJs - ReactJs - MongoDB stack. It's strength is that it has a straight functional naming and is fast and lightweight. It includes a logger with color handling, data validation utils, date utils, mongoDb utils. Check the list above for the function list:

``` javascript
const topkatUtils = {
    round,
    random,
    cln, // clean string for print. Eg: undefined, null, NaN => '-'
    pad, // simple padStart for numbers
    // ALIASES
    int,
    /** return the number or the closest number of the range
     * * nb min max  => returns
     * * 7  5   10   => 7 // in the range
     * * 2  5   10   => 5 // below the min value
     * * 99 5   10   => 10// above the max value
     */
    minMax, // 
    /** Generate random unique tokens (minLength 8 if unique) 
     * @param {Number} length default: 20
     * @param {Boolean} unique default: true. Generate a real unique token base on the date. min length will be min 8 in this case
     * @param {string} mode one of ['alphanumeric', 'hexadecimal']
     * NOTE: to generate a mongoDB Random Id, use the params: 24, true, 'hexadecimal'
     */
    generateToken,
    moyenne,
    // average between array of values. Eg: [5, 15] => 10 
    average,
    // sum values in an array
    sumArray,
    // sort an array of urls (useful for expressJs or react router. It avoid generic route home/ to take precedence over a more specific route like home/dshboard1)
    sortUrlsByDeepnessInArrayOrObject,
    // like nodeJs path.join() but for urls
    urlPathJoin,
    // miniTemplater(`Hello {{template}}`, {template: 'John'}) => `Hello John`
    miniTemplater,
    // is number between
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
    removeUndefinedKeys, // alias
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
    required: validator, // alias for readability
    validatorReturnErrArray,
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
    // isDateObject <= see validator.js
    getDuration,
    doDateOverlap,
    getDatesForDaysArrayBetweenTwoDates,
    getEndTimeFromDurationAndStartTime,
    getDate12FromDateAndTime,
    getMonthAsInt,
    isSunday,
    isMonday,
    isTuesday,
    isWednesday,
    isThursday,
    isFriday,
    isSaturday,
    isWeekend,
    nextMonday,
    nextTuesday,
    nextWednesday,
    nextThursday,
    nextFriday,
    nextSaturday,
    nextSunday,
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
    eachDayOfInterval,
    eachMonthOfInterval,
    differenceInMilliseconds,
    differenceInSeconds,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    getClosestExistingDateOfMonth,
    getNextMonthlyDate,
    getHolidayReferenceYear,
    getFirstDayOfHolidayReferenceYear,
    getLastDayOfHolidayReferenceYear,
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
}
```

Please contact me if you need further informations ( issue on github :) )