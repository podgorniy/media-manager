import { AppState } from './app-state'

export const ITEMS_COUNT_TO_QUERY = 18

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
