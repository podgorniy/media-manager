export function isDev() {
    return process.env.NODE_ENV !== 'production'
}

export function getPathSegments(path: string): Array<string> {
    path = path.replace(/^\/*|\/*$/g, '')
    path = path.replace(/\/{2,}/g, '/')
    return path.split('/')
}
