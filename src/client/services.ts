import {AppState} from './app-state'
import {autorun} from 'mobx'
import {isDev} from '../common/lib'
import {throttle} from './lib'

const VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING = isDev() ? 1.5 : 3

function initLoadingMoreService(appState: AppState) {
    autorun(function() {
        const {
            viewportHeight,
            pageScrolled,
            mediaListFullHeight,
            isAuthenticated,
            canLoadMore,
            isLoading,
            guestCollection
        } = appState
        const {concluded, exists, passwordProtected, passwordIsValid} = guestCollection
        const canLoadGuestCollection =
            concluded && exists && (!passwordProtected || (passwordProtected && passwordIsValid))
        if (
            (isAuthenticated || canLoadGuestCollection) &&
            !isLoading &&
            canLoadMore &&
            mediaListFullHeight - pageScrolled - viewportHeight <
                viewportHeight * VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING
        ) {
            appState.loadMore()
        }
    })

    appState.calcPageScrolled()
    window.addEventListener(
        'scroll',
        throttle(() => {
            appState.calcPageScrolled()
        }, 150)
    )

    appState.updateViewPortHeight()
    window.addEventListener('resize', () => {
        appState.updateViewPortHeight()
    })
}

function initResettingService(appState: AppState) {
    autorun(function() {
        if (appState.router.pathSegments.length) {
            appState.resetMedia()
        }
        if (appState.filters.tags.length >= 0) {
            appState.resetMedia()
        }
    })
}

function initSelectingCurrentCollectionId(appState: AppState) {
    autorun(() => {
        const collectionsCount = appState.collections.length
        const {currentCollectionUri} = appState
        if (collectionsCount > 0 && currentCollectionUri) {
            const existingMatchedCollection = appState.collections.reduce((matched, collection) => {
                if (matched) {
                    return matched
                }
                if (collection.uri === currentCollectionUri) {
                    return collection
                }
            }, null)
            if (existingMatchedCollection) {
                appState.setCurrentlyViewedCollection(existingMatchedCollection)
                appState.setCurrentlyViewedCollectionId(existingMatchedCollection._id)
                return
            }
        }
        appState.setCurrentlyViewedCollection(null)
        appState.setCurrentlyViewedCollectionId(null)
    })
}

function initGuestCollection(appState: AppState) {
    autorun((r) => {
        const {isAuthenticated, currentCollectionUri} = appState
        const {concluded, pending} = appState.guestCollection
        if (!isAuthenticated) {
            if (currentCollectionUri && (!pending && !concluded)) {
                appState.initGuestCollection().finally(() => {
                    r.dispose()
                })
            }
        } else {
            r.dispose()
        }
    })
}

let preloaded = new WeakMap()
function initPreloading(appState: AppState) {
    autorun((r) => {
        appState.urlsToPreload.forEach(o => {
            if (o && o.type === 'img') {
                const img = new Image()
                img.src = o.originalUrl
                preloaded.set(img, null)
            }
        })
    })
}

// Reacts to state changes
export function initServices(appState: AppState) {
    initResettingService(appState) // 1. Order matters
    initLoadingMoreService(appState) // 2. Order matters
    initSelectingCurrentCollectionId(appState)
    initGuestCollection(appState)
    initPreloading(appState)
}
