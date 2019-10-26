import { AppState } from './app-state'
import { autorun } from 'mobx'

const VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING = 1.5

function initLoadingMoreService(appState: AppState) {
    autorun(function() {
        const {
            viewportHeight,
            pageScrolled,
            mediaListFullHeight,
            isAuthenticated,
            canLoadMore,
            isLoading,
            currentCollectionUri
        } = appState
        if (
            (isAuthenticated || currentCollectionUri) &&
            !isLoading &&
            canLoadMore &&
            mediaListFullHeight - pageScrolled - viewportHeight <
                viewportHeight * VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING
        ) {
            appState.loadMore()
        }
    })

    appState.calcPageScrolled()
    window.addEventListener('scroll', () => {
        appState.calcPageScrolled()
    })

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

// Reacts to state changes
export function initServices(appState: AppState) {
    initResettingService(appState) // 1. Order matters
    initLoadingMoreService(appState) // 2. Order matters
    initSelectingCurrentCollectionId(appState)
}
