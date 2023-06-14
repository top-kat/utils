export function isEmpty(objOrArr: object | any[] | string | null | undefined) {
    if (Array.isArray(objOrArr) || typeof objOrArr === 'string') return objOrArr.length === 0
    else if (typeof objOrArr == 'object' && objOrArr !== null && !(objOrArr instanceof Date)) return Object.keys(objOrArr).length === 0
    else return false
  }