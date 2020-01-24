import {AppState} from './app-state'
import {isDev} from '../common/lib'

export const ITEMS_COUNT_TO_QUERY = isDev() ? 18 : 50

export function objToQueryString(obj: Object): string {
    let res = ''
    for (let key in obj) {
        if (res) {
            res += '&'
        }
        res = res + (encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
    return res
}

export function getRefreshQuery(appState: AppState) {
    return {
        tags: appState.filters.tags,
        collectionUri: appState.currentCollectionUri,
        limit: appState.media.length,
        skip: 0
    }
}

export function getLoadMoreQuery(appState: AppState) {
    return {
        tags: appState.filters.tags,
        collectionUri: appState.currentCollectionUri,
        limit: ITEMS_COUNT_TO_QUERY,
        skip: appState.loadedItemsCount
    }
}

export function throttle(fn, time) {
    let lastTimeCall = 0
    let planned = null
    let lastCallArgs
    return function() {
        lastCallArgs = arguments
        const now = Date.now()
        if (now - lastTimeCall > time) {
            lastTimeCall = now
            fn.apply(this, lastCallArgs)
        } else if (!planned) {
            planned = setTimeout(() => {
                planned = null
                lastTimeCall = Date.now()
                fn.apply(this, lastCallArgs)
            }, time)
        }
    }
}

const CONTROLS_NODE_NAMES = ['BUTTON', 'A', 'INPUT']

export function isControlFocused(): boolean {
    const activeElement = document.activeElement
    if (activeElement && activeElement.nodeName) {
        const activeElementNodeName = activeElement.nodeName
        if (CONTROLS_NODE_NAMES.indexOf(activeElementNodeName) !== -1) {
            return true
        }
    }
    return false
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
