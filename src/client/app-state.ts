import {action, computed, configure, IObservableArray, observable} from 'mobx'
import {fetchMedia, IFetchMediaHandler} from './api'
import {IAppInitialState, IClientMediaItem, IMediaResponse, IUserMediaItem} from '../common/interfaces'
import {AppRouter} from './app-router'

const axios = require('axios')

configure({
    enforceActions: 'observed' // https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#actions
})

type ISetAuthenticatedParams = boolean | {userName: string}

const SIDE_WIDTH_EXPANDED = 300
const SIDE_WIDTH_COLLAPSED = 50

const COLUMNS_COUNT_WHEN_SIDE_COLLAPSED = 4
const COLUMNS_COUNT_WHEN_SIDE_EXPANDED = 3

const ITEMS_COUNT_TO_QUERY = 5

function toClientSideRepresentation(mediaDoc: IUserMediaItem): IClientMediaItem {
    return {
        ...mediaDoc,
        focused: false
    }
}

interface ITagItem {
    name: string
}

export class AppState {
    constructor(initialState: IAppInitialState) {
        this.router = new AppRouter(initialState.url || location.href)
        this.setAuthenticated({userName: initialState.userName})
    }

    router: AppRouter

    @observable
    media: IObservableArray<IClientMediaItem> = [] as IObservableArray<IClientMediaItem>

    @action.bound
    resetMedia() {
        if (this.loadMoreHandler) {
            this.loadMoreHandler.cancel()
            this.isLoading = false
            this.canLoadMore = true
            this.loadMoreHandler = null
        }
        this.media.clear()
    }

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

    @observable
    selectedUUIDs: IObservableArray<string> = [] as IObservableArray<string>

    @computed
    get selectedVisibleUUIDs() {
        return this.selectedUUIDs.filter((itemUUID) => {
            return this.media.some(({uuid}) => {
                return itemUUID === uuid
            })
        })
    }

    @action.bound
    toggleSelected(uuid: string) {
        const itemIndex = this.selectedUUIDs.indexOf(uuid)
        if (itemIndex === -1) {
            this.selectedUUIDs.push(uuid)
        } else {
            this.selectedUUIDs.splice(itemIndex, 1)
        }
    }

    @action.bound
    unselectAll() {
        this.selectedUUIDs.clear()
    }

    @action.bound
    unselectVisibleOnly() {
        this.media.forEach(({uuid}) => {
            const currentItemSelectedIndex = this.selectedUUIDs.indexOf(uuid)
            if (currentItemSelectedIndex !== -1) {
                this.selectedUUIDs.splice(currentItemSelectedIndex, 1)
            }
        })
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

    /**
     * Load media items
     */
    @observable
    isLoading: boolean = false

    @observable
    canLoadMore: boolean = true

    @computed
    get loadedItemsCount() {
        return this.media.length
    }

    @action.bound
    async loadMore() {
        try {
            this.isLoading = true
            this.loadMoreHandler = fetchMedia({
                limit: ITEMS_COUNT_TO_QUERY,
                skip: this.loadedItemsCount,
                tags: this.filters.tags
            })
            let res = await this.loadMoreHandler.response
            this.processLoadResponse(res)
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error(err)
            }
        }
    }

    loadMoreHandler: IFetchMediaHandler

    @computed
    get filters() {
        return {
            tags: this.router.queryParams.tags || []
        }
    }

    @action.bound
    processLoadResponse(response: IMediaResponse) {
        const {success, items, hasMore} = response
        if (success) {
            for (let i = 0; i < items.length; i += 1) {
                this.media.push(toClientSideRepresentation(items[i]))
            }
            this.canLoadMore = hasMore
        } else {
            this.canLoadMore = true
            alert(`Failed to load media items`)
        }
        this.isLoading = false
    }

    /**
     * Item id for zoomed view
     */
    @observable
    zoomedItemId: string = null

    @computed
    get zoomedItem() {
        const zoomedIndex = this.media.findIndex((item) => item.uuid === this.zoomedItemId)
        return this.media[zoomedIndex]
    }

    @action.bound
    setZoomed(uuid: string | null) {
        if (uuid) {
            this.setFocused(uuid)
        }
        this.zoomedItemId = uuid
    }

    /**
     * Select next, prev or n item for zoomed view
     * @param indexShift
     */
    @action.bound
    shiftZoomed(indexShift: number) {
        const zoomedIndex = this.media.findIndex((item) => item.uuid === this.zoomedItemId)
        const newZoomedIndex = zoomedIndex + indexShift
        const lastItemIndex = this.media.length - 1
        if (newZoomedIndex > lastItemIndex) {
            this.setZoomed(this.media[lastItemIndex].uuid)
        } else if (newZoomedIndex < 0) {
            this.setZoomed(this.media[0].uuid)
        } else {
            this.setZoomed(this.media[newZoomedIndex].uuid)
        }
    }

    /**
     * Item which is hovered at the moment
     */
    @observable
    hoveredId: string = null
    @action.bound
    setHoveredId(id) {
        if (!this.zoomedItemId) {
            this.setFocused(id)
        }
        this.hoveredId = id
    }

    /**
     * One item that currently has focus
     * Focus will be assigned on hover
     * Zoomed item is also a focused item
     */
    @computed
    get focusedId(): null | string {
        const focusedItem = this.media.find((item) => item.focused)
        if (!focusedItem) {
            return null
        }
        return focusedItem.uuid
    }

    @action.bound
    setFocused(id: string) {
        this.media.forEach((mediaItem) => {
            mediaItem.focused = mediaItem.uuid === id
        })
    }

    @observable
    viewportHeight: number
    @action.bound
    updateViewPortHeight() {
        this.viewportHeight = window.innerHeight
    }

    @observable
    pageScrolled: number
    @action.bound
    calcPageScrolled() {
        this.pageScrolled = document.body.scrollTop
    }

    @observable
    mediaListFullHeight: number = 0
    @action.bound
    setMediaListFullHeight(newValue: number) {
        this.mediaListFullHeight = newValue
    }

    @observable
    tags: Array<ITagItem> = []

    @action.bound
    setTags(newTags: Array<ITagItem>): void {
        this.tags = newTags
    }

    @observable
    uploadIsVisible = false

    @action.bound
    toggleUploadVisibility(state?: boolean) {
        if (typeof state !== 'boolean') {
            this.uploadIsVisible = !this.uploadIsVisible
        } else {
            this.uploadIsVisible = state
        }
    }
}

export interface IAppState {
    appState?: AppState
}
