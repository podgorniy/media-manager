import {action, computed, configure, observable} from 'mobx'
import {IAppInitialState, IAppMediaItem} from '../common/interfaces'

configure({
    enforceActions: 'observed' // https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#actions
})

type ISetAuthenticatedParams = boolean | {userName: string}

export class AppState {
    constructor(initialState: IAppInitialState) {
        this.media = initialState.userMedia.map((item) => {
            let appMediaItem: IAppMediaItem = {
                ...item,
                selected: false
            }
            return appMediaItem
        })
        this.setAuthenticated({userName: initialState.userName})
    }

    @observable
    media: Array<IAppMediaItem>

    @observable
    userName: string

    @action.bound
    setAuthenticated(params: ISetAuthenticatedParams) {
        if (typeof params === 'object') {
            this.userName = params.userName
        } else {
            this.userName = ''
        }
    }

    @action.bound
    toggleSelected(fileName: string) {
        this.media.forEach((mediaItem) => {
            if (mediaItem.fileName === fileName) {
                mediaItem.selected = !mediaItem.selected
            }
        })
    }

    @computed
    get isAuthenticated() {
        return !!this.userName
    }

    @observable
    count = 0

    @action.bound
    changeCount(newVal: number) {
        this.count += newVal
    }
}

export interface IAppState {
    appState?: AppState
}
