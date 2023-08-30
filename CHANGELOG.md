### v1.2.48
* FIX getId so that it can accept any strings

### v1.2.45
* Add parent and lastElement key to informations returned by findByAddressAll

### v1.2.44
* FIX recursiveGenericFunction and findByAddressAll
* ADD new option in escapeRegexp
* alias parseRegexp => escapeRegexp

### v1.2.43
* FIX recursiveGenericFunctionSync returning bad address (starting with a point)

### v1.2.42
* add nbOccurenceInString and fix some types

### v1.2.41
* improving types for object helpers

### v1.2.39
* FIX capitalize1st error when emptyy string

### v1.2.38
* convertAccentedCharacters now taking in account upper case letters

### v1.2.36
* FIX typeof config partial and required

### v1.2.35
* other fix logFromOtherErr is not iterable

### v1.2.34
* FIX "cannot read propertie undefined..." error when logging an undefined entry

### v1.2.33
* FIX typescript errors when on projects with strict mode

### v1.2.31
* FIX loading spinner not exported

### v1.2.30
* FIX type in randomItemInArray

### v1.2.29
* FIX validator isset not working on undefined values

### v1.2.26
* improve int typing accepting both string and number

### v1.2.25
* FIX isType not working on emty string

### v1.2.24
* improve tryCatch / failSafe to work with async and sync functions natively

### v1.2.23
* Added forcePathInObject() to force an existing path in an object, like an empty object or array
* adding failSafe as an alias of tryCatch for readability
* improving type for tryCatch()

### v1.2.22
* remove usage of array.at(-1) since it's not compatible with react native or older versions of node

### v1.2.21
* FIX error was not logging in some case with DescriptieError

### v1.2.20
* remove arrayToObjectSorted
* greatly improve typings on all compareArrays functions
* improve error display and logging, adding originalError to extraInfos, cleanStackTrace of original error
* added eslintconfig

### v1.2.17
* added a relevant toString method to DescriptiveError class
* improved error logging

### v1.2.16
* ADD onError to config for custom error handling
* improve logging
* add frontend compatibility

### v1.2.15
* Find by address now accepts string array for address

### v1.2.14
* objForceWrite now return main object
* improve type on objectutils

### v1.2.13
* add ability to hide generated api code in errors by setting { code } value to undefined, null or option.doNotDisplayCode to true
* allow all casing function to receive an array of string as first argument OR rest param as a string array

### v1.2.12
* ADD returnValueIfUndefined for asArray function and improve type

### v1.2.11
* FIX on terminal noColor detection nodeJs env

### v1.2.10
* NEW isNodeJs fn
* Default terminal color when on nodejs

### v1.2.9
* Fix error noStackTrace

### v1.2.7
* adding option noStackTrace to error
* improve type of findByAddressAll

### v1.2.6
* mini fix on escapeRegexp option parseStarChar, now replacing
* will 'match all until'. Before it was just 'match all'

### v1.2.5
* improve deleteByAddress to accept [0] array syntax in addr AND string AND string array as addr argument

### v1.2.3
* default terminal no color to avoid displaying strange characters when outputting logs for front end

### v1.2.2
* fix ts problem compiling class with ES6

### v1.2.1
* NEW DescriptiveError class for more explicit errors
* MINOR VERSION TRANSITION => A little change of api with validatorReturnErrArray that returns [msg, extraInfos][] instead of [msg, httpErrorCode, extraInfos][]. Now the ode is in the extra infos

### v1.1.9
* add option disableCircularDependencyRemoval to recursive helpers

### v1.1.5
* add isset to validator (improves readability)

### v1.1.1
* test OK
* NEW WTF utils removed circular dependencies

### v1.0.58
* BREAKING remove export default

### v1.0.57
* improve typings for recursive generic

### v1.0.51
* add param to `findByAddressAll` returnAddresses for returning found items alongside their address

### v1.0.49
* Add/fix email type in validator
* imrove typings on forI function

### v1.0.47
* deep clone type improvement

### v1.0.46
* FIX templater undefined no error anymore

### v1.0.42
* type for date function

### v1.0.40
* NEW forI iterate function

### v1.0.39
* NEW ability for restTestMini to throw error

### v1.0.37
* add generateObjectId
* cleaning and typing improvements

### v1.0.35
* fix in asArray typing

### v1.0.32
* safer generateToken

### v1.0.28
* nextWeekDay

### v1.0.27
* arrayCount count the nb of occurence of an item in array
* isBetween inclusive option (default true)

### v1.0.25
* NEW restTestMini mini test framework

### v1.0.9
* assert used for testing

### v1.0.5
* new alias randomize array
* type for asArray

### v1.0.3
* new err handling
* escapeRegexp config with parseStarChar option