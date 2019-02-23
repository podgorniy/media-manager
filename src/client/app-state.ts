import {action, computed, configure, observable} from 'mobx'
import {IAppInitialState, IAppMediaItem} from '../common/interfaces'

configure({
    enforceActions: 'observed' // https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#actions
})

type ISetAuthenticatedParams = boolean | {userName: string}

const SIDE_WIDTH_EXPANDED = 300
const SIDE_WIDTH_COLLAPSED = 50

const COLUMNS_COUNT_WHEN_SIDE_COLLAPSED = 4
const COLUMNS_COUNT_WHEN_SIDE_EXPANDED = 3

export class AppState {
    constructor(initialState: IAppInitialState) {
        this.media = initialState.userMedia
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
    toggleSelected(uuid: string) {
        this.media.forEach((mediaItem) => {
            if (mediaItem.uuid === uuid) {
                mediaItem.selected = !mediaItem.selected
            }
        })
    }

    @action.bound
    unselectAll() {
        this.media.forEach((mediaItem) => (mediaItem.selected = false))
    }

    @computed
    get isAuthenticated() {
        return !!this.userName
    }

    @computed
    get columnsCount() {
        if (this.sideExpanded) {
            return COLUMNS_COUNT_WHEN_SIDE_EXPANDED
        } else {
            return COLUMNS_COUNT_WHEN_SIDE_COLLAPSED
        }
    }

    @computed
    get sideWidth() {
        if (this.sideExpanded) {
            return SIDE_WIDTH_EXPANDED
        } else {
            return SIDE_WIDTH_COLLAPSED
        }
    }

    @observable
    sideExpanded: boolean = true

    @action.bound
    toggleSide() {
        this.sideExpanded = !this.sideExpanded
    }

    /**
     * Hack. To be able to hook autorun after factual react render
     */
    @observable
    layoutRerenderCount: number = 0

    @action.bound
    incLayoutRerenderCount() {
        this.layoutRerenderCount += 1
    }

    @computed
    get selected(): Array<IAppMediaItem> {
        return this.media.filter((item) => item.selected)
    }
}

export interface IAppState {
    appState?: AppState
}
