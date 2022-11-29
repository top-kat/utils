export function isset(...elms) {
    return elms.every(elm => typeof elm !== 'undefined' && elm !== null)
}