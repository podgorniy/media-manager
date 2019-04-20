import {AppState} from './app-state'
import {autorun} from 'mobx'

const VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING = 1.5

function initLoadingMoreService(appState: AppState) {
    autorun(function() {
        const {viewportHeight, pageScrolled, mediaListFullHeight, isAuthenticated, canLoadMore, isLoading} = appState
        if (
            isAuthenticated &&
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
        if (appState.filters.tags.length >= 0) {
            appState.resetMedia()
        }
    })
}

// Reacts to state changes
export function initServices(appState: AppState) {
    initResettingService(appState) // 1. Order matters
    initLoadingMoreService(appState) // 2. Order matters
}
