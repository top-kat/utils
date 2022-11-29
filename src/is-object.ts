
/** test if object but not array and not null (null is an object in Js) */
export function isObject(o: any): boolean { return o instanceof Object && [Object, Error].includes(o.constructor) }