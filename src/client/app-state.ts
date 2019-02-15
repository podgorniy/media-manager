import {action, computed, configure, observable} from 'mobx'
import {IAppInitialState, IUserMediaItem} from '../common/interfaces'

configure({
    enforceActions: 'observed' // https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#actions
})

type ISetAuthenticatedParams = boolean | {userName: string}

export class AppState {
    constructor(initialState: IAppInitialState) {
        console.log(`initialState`, initialState)
        this.media = initialState.userMedia
        this.setAuthenticated({userName: initialState.userName})
    }

    @observable
    media: Array<IUserMediaItem>

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
