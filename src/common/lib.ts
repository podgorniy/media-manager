export function isDev() {
    return process.env.NODE_ENV !== 'production'
}

export function getPathSegments(path: string): Array<string> {
    path = path.replace(/^\/*|\/*$/g, '')
    path = path.replace(/\/{2,}/g, '/')
    return path.split('/')
}

// copy from mdn: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Throttles func to 60 fps. Calls with params passed on latest call
 */
export function throttleTo60Fps(func): (args) => void {
    let animationFrameRequested = false
    let params
    return (...args) => {
        params = [...args]
        if (!animationFrameRequested) {
            animationFrameRequested = true
            requestAnimationFrame(() => {
                animationFrameRequested = false
                func.apply(this, params) // call with latest params passed
            })
        }
    }
}
