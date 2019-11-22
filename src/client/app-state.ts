import {action, computed, configure, flow, IObservableArray, observable} from 'mobx'
import {
    addTags,
    addToCollection,
    checkCollection,
    createCollection,
    deleteCollection,
    fetchMedia,
    fetchTags,
    getCollections,
    ICheckCollectionResult,
    IFetchMediaHandler,
    removeFromCollection,
    removeTags,
    shareMedia,
    unShareMedia
} from './api'
import {IClientMediaItem, ICollectionItem, IMediaResponse, IUserMediaItem, UUID} from '../common/interfaces'
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

export interface IGuestCollectionParams {
    pending?: boolean
    exists?: boolean
    passwordProtected?: boolean
    password?: string
    concluded?: boolean
    passwordIsValid?: boolean
}

export interface IGuestCollection extends IGuestCollectionParams {
    pending: boolean
    exists: boolean
    passwordProtected: boolean
    password: string
    concluded: boolean
    passwordIsValid: boolean
}

export class AppState {
    constructor() {
        this.router = new AppRouter(location.href)
        this.setAuthenticated(!!window['isAuthenticated'])
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
    currentlyViewedOwnCollection: ICollectionItem

    @observable
    guestsCurrentCollectionPass: string

    @observable
    guestCollection: IGuestCollection = {
        pending: false,
        exists: false,
        concluded: false,
        passwordProtected: false,
        password: '',
        passwordIsValid: false
    }

    @observable
    guestsCurrentCollectionPassIsValid: boolean = false

    @observable
    waitingForCurrentCollectionGuestsPassValidation: boolean = false

    @computed
    get selectedVisibleUUIDs() {
        return this.selectedUUIDs.filter((itemUUID) => {
            return this.media.some(({uuid}) => {
                return itemUUID === uuid
            })
        })
    }

    @observable
    isAuthenticated = false

    @computed
    get layoutColumnsCount(): number {
        if (!this.isAuthenticated) {
            return 5
        } else if (this.sideExpanded) {
            return 4
        } else {
            return 5
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
    setAuthenticated(authenticated: boolean) {
        this.isAuthenticated = authenticated
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
    unselectSelected() {
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
        let currentlyViewedCollectionId = this.currentlyViewedOwnCollection && this.currentlyViewedOwnCollection._id
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
    async removeTagFrom(tagName: string, uuids: Array<string>) {
        try {
            await removeTags({
                tags: [tagName],
                media: uuids
            })
            this.removeTagsLocallyFrom([tagName], uuids)
            this.refreshTags()
            this.refreshMedia()
        } catch (err) {
            console.error(err)
        }
    }

    @action.bound
    removeTagsLocallyFrom(tagsList: Array<string>, uuids: Array<string>) {
        this.media.forEach((mediaItem) => {
            if (uuids.indexOf(mediaItem.uuid) !== -1) {
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

    async addTagFor(tags: Array<string>, UUIDs: Array<UUID>) {
        await addTags(tags, UUIDs)
        this.addTagForLocalMedia(tags, UUIDs)
        this.refreshTags()
        this.refreshMedia()
    }

    @action.bound
    addTagForLocalMedia(tagList: Array<string>, UUIDs: Array<UUID>) {
        this.media.forEach((mediaItem) => {
            if (UUIDs.indexOf(mediaItem.uuid) !== -1) {
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
    async refreshCollections() {
        const data = await getCollections()
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
        if (newVal && this.currentlyViewedOwnCollection && this.currentlyViewedOwnCollection._id === newVal._id) {
            return
        } else {
            this.currentlyViewedOwnCollection = newVal
            this.refreshTags()
        }
    }

    @action.bound
    setCurrentlyViewedCollectionId(newId) {
        this.currentlyViewedCollectionId = newId
    }

    @action.bound
    async addToCollection(collectionId: string, UUIDs: Array<UUID>) {
        await addToCollection({
            collectionId: collectionId,
            items: UUIDs
        })
        this.refreshCollections()
        this.refreshMedia()
    }

    @action.bound
    async removeSelectedFromCollection(collectionId: string) {
        await removeFromCollection({
            collectionId: collectionId,
            items: this.selectedUUIDs
        })
        this.refreshCollections()
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
        this.refreshCollections()
    }

    @action.bound
    addToSelection(UUIDs: Array<UUID>) {
        UUIDs.forEach((uuid) => {
            if (this.selectedUUIDs.indexOf(uuid) === -1) {
                this.selectedUUIDs.push(uuid)
            }
        })
    }

    @action.bound
    removeFromSelection(UUIDs: Array<UUID>) {
        UUIDs.forEach((uuid) => {
            const index = this.selectedUUIDs.indexOf(uuid)
            if (index !== -1) {
                this.selectedUUIDs.splice(index, 1)
            }
        })
    }

    @action.bound
    updateGuestCollectionState(params: IGuestCollectionParams) {
        this.guestCollection = Object.assign({}, this.guestCollection, params)
    }

    initGuestCollection = flow(function*(this: AppState) {
        this.updateGuestCollectionState({pending: true})
        try {
            const collectionStatus: ICheckCollectionResult = yield checkCollection({
                uri: this.currentCollectionUri
            })
            if (collectionStatus && collectionStatus.exists) {
                this.updateGuestCollectionState({exists: true})
                if (collectionStatus.passwordProtected) {
                    this.updateGuestCollectionState({
                        passwordProtected: true
                    })
                    do {
                        let userPromptedPass = prompt('Password for this collection')
                        if (!userPromptedPass) {
                            this.updateGuestCollectionState({
                                concluded: true,
                                passwordIsValid: false,
                                pending: false
                            })
                            break
                        }
                        userPromptedPass = userPromptedPass.trim()
                        const validationResult: ICheckCollectionResult = yield checkCollection({
                            uri: this.currentCollectionUri,
                            password: userPromptedPass
                        })
                        if (validationResult && validationResult.passwordIsValid) {
                            this.updateGuestCollectionState({
                                exists: true,
                                pending: false,
                                concluded: true,
                                password: userPromptedPass,
                                passwordIsValid: true
                            })
                            break
                        }
                    } while (true)
                } else {
                    this.updateGuestCollectionState({concluded: true, passwordProtected: false, pending: false})
                }
            } else {
                this.updateGuestCollectionState({exists: false, pending: false, concluded: true})
            }
        } catch (e) {
            console.error(e)
            this.updateGuestCollectionState({pending: false, concluded: true, exists: false})
        }
    })

    asObj() {
        return JSON.parse(JSON.stringify(this))
    }
}

export interface IAppState {
    appState?: AppState
}
