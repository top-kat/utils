
export function removeCircularJSONstringify(object, indent = 2) {
    const getCircularReplacer = () => {
        const seen = new WeakSet()
        return (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return
                }
                seen.add(value)
            }
            return value
        }
    }

    return JSON.stringify(object, getCircularReplacer(), indent)
}