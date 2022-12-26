
export function cleanStackTrace(stack) {
    if (typeof stack !== 'string') return ''
    stack.replace(/home\/[^/]+\/[^/]+\//g, '')
    const lines = stack.split('\n')
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
    ]
    const linesClean = lines
        .map((line, i) => {
            if (i === 0) return ''
            else {
                const [, start, fileName, end] = line.match(/(^.+\/)([^/]+:\d+:\d+)(.{0,3})/) || []
                return fileName ? `\x1b[2m${start}\x1b[0m${fileName}\x1b[2m${end}\x1b[0m` : `\x1b[2m${line}\x1b[0m`
            }
        })
        .filter(l => l && !removeIfContain.some(text => l.includes(text)))
        .join('\n')
    return linesClean
}
