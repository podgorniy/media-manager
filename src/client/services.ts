import {AppState} from './app-state'
import {autorun} from 'mobx'

const VIEW_PORTS_BELOW_SCREEN_TO_TRIGGER_LOADING = 1.5

function initLoadMoreService(appState: AppState) {
    autorun(function() {
        const {viewportHeight, pageScrolled, mediaListFullHeight, userName} = appState
        userName // keep. Should react if username changed (i.e. user logged-in, logged-out)
        if (
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

    appState.calcViewPortHeight()
    window.addEventListener('resize', () => {
        appState.calcViewPortHeight()
    })
}

// Reacts to state changes
export function initServices(appState: AppState) {
    initLoadMoreService(appState)
}
