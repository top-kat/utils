

export function isNodeJs(): boolean {
    try {
        return (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')
    } catch (e) {
        return false
    }
}