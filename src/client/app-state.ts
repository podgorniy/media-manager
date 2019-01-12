import {observable, configure, action} from 'mobx'

configure({
    enforceActions: 'observed'
})

export class AppState {
    @observable isAuthenticated = false

    @observable count = 0

    @action.bound
    changeCount(newVal: number) {
        this.count += newVal
    }
}

export interface IAppState {
    appState?: AppState
}
