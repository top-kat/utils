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