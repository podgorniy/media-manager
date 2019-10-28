import {action, computed, configure, IObservableArray, observable} from 'mobx'
import {
    addTags,
    addToCollection,
    createCollection,
    deleteCollection,
    fetchMedia,
    fetchTags,
    getCollectionsList,
    IFetchMediaHandler,
    removeFromCollection,
    removeTags,
    shareMedia,
    unShareMedia
} from './api'
import {IAppInitialState, IClientMediaItem, ICollectionItem, IMediaResponse, IUserMediaItem} from '../common/interfaces'
import {AppRouter} from './app-router'
import {getLoadMoreQuery, getRefreshQuery} from './lib'

const axios = require('axios')

configure({
    enforceActions: 'observed' // https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#actions
})

type ISetAuthenticatedParams = boolean | {userName: string}

const SIDE_WIDTH_EXPANDED = 300
const SIDE_WIDTH_COLLAPSED = 60

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

    @observable
    userName: string

    @observable
    selectedUUIDs: IObservableArray<string> = [] as IObservableArray<string>

    @observable
    sideExpanded: boolean = true

    /**
     * Hack. To be able to hook autorun after factual react render
     */
    @observable
    layoutRerenderCount: number = 0

    /**
     * Load media items
     */
    @observable
    isLoading: boolean = false

    @observable
    canLoadMore: boolean = true

    /**
     * Item id for zoomed view
     */
    @observable
    zoomedItemId: string = null

    /**
     * Item which is hovered at the moment
     */
    @observable
    hoveredId: string = null

    @observable
    viewportHeight: number

    @observable
    pageScrolled: number

    @observable
    mediaListFullHeight: number = 0

    @observable
    tags: Array<ITagItem> = []

    @observable
    uploadIsVisible = false

    @observable
    collections: Array<ICollectionItem> = []

    @observable
    currentlyViewedCollectionId = null

    @observable
    currentlyViewedCollection: ICollectionItem

    /**
     * Only which are loaded
     */
    @computed
    get selectedItems(): Array<IClientMediaItem> {
        return this.media.filter((item) => this.selectedUUIDs.indexOf(item.uuid) !== -1)
    }

    @computed
    get selectedVisibleUUIDs() {
        return this.selectedUUIDs.filter((itemUUID) => {
            return this.media.some(({uuid}) => {
                return itemUUID === uuid
            })
        })
    }

    @computed
    get isAuthenticated() {
        return !!this.userName
    }

    @computed
    get layoutColumnsCount(): number {
        if (!this.isAuthenticated) {
            return 4
        } else if (this.sideExpanded) {
            return 3
        } else {
            return 4
        }
    }

    @computed
    get sideWidth() {
        if (!this.isAuthenticated) {
            return 0
        } else if (this.sideExpanded) {
            return SIDE_WIDTH_EXPANDED
        } else {
            return SIDE_WIDTH_COLLAPSED
        }
    }

    @computed
    get loadedItemsCount() {
        return this.media.length
    }

    @computed
    get filters() {
        return {
            tags: this.router.queryParams.tags || []
        }
    }

    @computed
    get zoomedItem() {
        const zoomedIndex = this.media.findIndex((item) => item.uuid === this.zoomedItemId)
        return this.media[zoomedIndex]
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

    @computed
    get selectedItemsTags() {
        let tagsSet: Set<string> = this.media
            .slice()
            .filter((mediaItem) => {
                return this.selectedUUIDs.indexOf(mediaItem.uuid) !== -1
            })
            .map((mediaItem) => {
                return mediaItem.tags
            })
            .reduce((resSet, tagsArr) => {
                tagsArr.forEach((tag) => resSet.add(tag))
                return resSet
            }, new Set<string>())
        let tagsArr = [...tagsSet]
        tagsArr.sort()
        return tagsArr
    }

    @computed
    get currentCollectionUri(): string | null {
        const [_, collectionUrl] = this.router.pathSegments
        return collectionUrl || null
    }

    @action.bound
    resetMedia() {
        if (this.loadMoreHandler) {
            this.loadMoreHandler.cancel()
            this.isLoading = false
            this.loadMoreHandler = null
        }
        if (this.refreshHandler) {
            this.refreshHandler.cancel()
        }
        this.canLoadMore = true
        this.media.clear()
    }

    @action.bound
    setAuthenticated(params: ISetAuthenticatedParams) {
        if (typeof params === 'object') {
            this.userName = params.userName
        } else {
            this.userName = ''
        }
        // New login means that
        this.resetMedia()
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

    @action.bound
    toggleSide() {
        this.sideExpanded = !this.sideExpanded
    }

    @action.bound
    incLayoutRerenderCount() {
        this.layoutRerenderCount += 1
    }

    loadMoreHandler: IFetchMediaHandler
    @action.bound
    async loadMore() {
        try {
            this.isLoading = true
            this.loadMoreHandler = fetchMedia(getLoadMoreQuery(this))
            let res = await this.loadMoreHandler.response
            this.processLoadMoreResponse(res)
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error(err)
            }
        }
    }

    refreshHandler: IFetchMediaHandler
    @action.bound
    async refreshMedia() {
        try {
            if (this.refreshHandler) {
                this.refreshHandler.cancel()
            }
            this.refreshHandler = fetchMedia(getRefreshQuery(this))
            let res = await this.refreshHandler.response
            this.processRefreshResponse(res)
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error(err)
            }
        }
    }

    @action.bound
    processRefreshResponse(response: IMediaResponse) {
        const {items, success} = response
        if (success) {
            this.media.replace(items.map((item) => toClientSideRepresentation(item)))
        } else {
            console.error(`Error`)
        }
    }

    @action.bound
    processLoadMoreResponse(response: IMediaResponse) {
        const {success, items, hasMore} = response
        if (success) {
            for (let i = 0; i < items.length; i += 1) {
                this.media.push(toClientSideRepresentation(items[i]))
            }
            this.canLoadMore = hasMore
        } else {
            this.canLoadMore = false
            alert(`Failed to load media items`)
        }
        this.isLoading = false
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

    @action.bound
    setHoveredId(id) {
        if (!this.zoomedItemId) {
            this.setFocused(id)
        }
        this.hoveredId = id
    }

    @action.bound
    setFocused(id: string) {
        this.media.forEach((mediaItem) => {
            mediaItem.focused = mediaItem.uuid === id
        })
    }

    @action.bound
    updateViewPortHeight() {
        this.viewportHeight = window.innerHeight
    }

    @action.bound
    calcPageScrolled() {
        this.pageScrolled = document.body.scrollTop
    }

    @action.bound
    setMediaListFullHeight(newValue: number) {
        this.mediaListFullHeight = newValue
    }

    @action.bound
    setTags(newTags: Array<ITagItem>): void {
        this.tags = newTags
    }

    private removeUnexistingUrlTag(existingTags: Array<ITagItem>) {
        const existingTagsNames = existingTags.map(({name}) => {
            return name
        })
        const listUrlTags = this.router.queryParams.tags || []
        const tagsToRemove = listUrlTags.filter((tag) => {
            return existingTagsNames.indexOf(tag) === -1
        })
        this.router.replaceUrl(
            this.router.getFullUrl({
                without: {
                    queryParams: {
                        tags: tagsToRemove
                    }
                }
            })
        )
    }

    async refreshTags() {
        if (!this.isAuthenticated) {
            return
        }
        let params = {}
        let currentlyViewedCollectionId = this.currentlyViewedCollection && this.currentlyViewedCollection._id
        if (currentlyViewedCollectionId) {
            params = {
                collectionId: currentlyViewedCollectionId
            }
        }
        try {
            let resp = await fetchTags(params)
            this.setTags(resp.tags)
            this.removeUnexistingUrlTag(resp.tags)
        } catch (err) {
            console.error(err)
        }
    }

    @action.bound
    toggleUploadVisibility(state?: boolean) {
        if (typeof state !== 'boolean') {
            this.uploadIsVisible = !this.uploadIsVisible
        } else {
            this.uploadIsVisible = state
        }
    }

    @action.bound
    async removeTagFromSelectedRemotely(tagName: string) {
        try {
            await removeTags({
                tags: [tagName],
                media: this.selectedUUIDs
            })
            this.removeTagFromSelectedLocally([tagName])
            this.refreshTags()
            this.refreshMedia()
        } catch (err) {
            console.error(err)
        }
    }

    @action.bound
    removeTagFromSelectedLocally(tagsList: Array<string>) {
        this.media.forEach((mediaItem) => {
            if (this.selectedUUIDs.indexOf(mediaItem.uuid) !== -1) {
                mediaItem.tags = mediaItem.tags.filter((tagName) => {
                    if (tagsList.indexOf(tagName) !== -1) {
                        return false
                    } else {
                        return true
                    }
                })
            }
        })
    }

    async addTagForSelectedRemotely(tags: Array<string>) {
        await addTags(tags, this.selectedUUIDs)
        this.addTagForSelectedLocally(tags)
        this.refreshTags()
        this.refreshMedia()
    }

    @action.bound
    addTagForSelectedLocally(tagList: Array<string>) {
        this.media.forEach((mediaItem) => {
            if (this.selectedUUIDs.indexOf(mediaItem.uuid) !== -1) {
                tagList.forEach((addedTagName) => {
                    if (mediaItem.tags.indexOf(addedTagName) === -1) {
                        mediaItem.tags.push(addedTagName)
                    }
                })
            }
        })
    }

    @action.bound
    selectAllLoaded() {
        this.media.forEach(({uuid}) => {
            if (this.selectedUUIDs.indexOf(uuid) === -1) {
                this.selectedUUIDs.push(uuid)
            }
        })
    }

    @action.bound
    async refreshCollectionsList() {
        const data = await getCollectionsList()
        if (data) {
            this.setCollections(data)
        }
    }

    @action.bound
    setCollections(collections) {
        this.collections = collections
    }

    @action.bound
    async createCollection(collectionName: string) {
        let success = await createCollection(collectionName)
        return success
    }

    @action.bound
    setCurrentlyViewedCollection(newVal: null | ICollectionItem) {
        if (newVal && this.currentlyViewedCollection && this.currentlyViewedCollection._id === newVal._id) {
            return
        } else {
            this.currentlyViewedCollection = newVal
            this.refreshTags()
        }
    }

    @action.bound
    setCurrentlyViewedCollectionId(newId) {
        this.currentlyViewedCollectionId = newId
    }

    @action.bound
    async addSelectedToCollection(collectionId: string) {
        await addToCollection({
            collectionId: collectionId,
            items: this.selectedUUIDs
        })
        this.refreshCollectionsList()
        this.refreshMedia()
    }

    @action.bound
    async removeSelectedFromCollection(collectionId: string) {
        await removeFromCollection({
            collectionId: collectionId,
            items: this.selectedUUIDs
        })
        this.refreshCollectionsList()
        this.refreshMedia()
    }

    @action.bound
    async shareMedia(uuid: string) {
        await shareMedia({uuid: uuid})
        this.refreshTags()
        this.refreshMedia()
    }

    @action.bound
    async unShareMedia(uuid: string) {
        await unShareMedia({uuid: uuid})
        this.refreshTags()
        this.refreshMedia()
    }

    @action.bound
    async deleteCollection(collectionId) {
        await deleteCollection({collectionId: collectionId})
        this.refreshCollectionsList()
    }

    asObj() {
        return JSON.parse(JSON.stringify(this))
    }
}

export interface IAppState {
    appState?: AppState
}
