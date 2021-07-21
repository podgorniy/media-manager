// Keep .ts extension. Otherwise parcel bundler fails to find this file dependency
// TODO: try to rename to d.ts after parcel version update from 1.10.3

import {Document} from 'mongoose'

export interface IUserMediaItem {
    originalUrl: string
    previewUrl: string
    tags: Array<string>
    uuid: string
    type: MediaType
    sharedIndividually: boolean
    width: number
    height: number
}

// Client side representation of media item
export interface IClientMediaItem extends IUserMediaItem {
    focused: boolean
}

export interface IMediaResponse {
    items: Array<IUserMediaItem>
    success: boolean
    hasMore: boolean
}

export interface IProvideMediaParams {
    skip?: number
    limit?: number
    tags?: Array<string>
    collectionUri?: string
}

export type MediaType = 'img' | 'video'

export interface ITagsListItem {
    name: string
}

export type UUID = string

export interface ICollectionFields {
    uri: string
    media: Array<UUID>
    public: boolean
    title: string
    owner: string
    publicPassword: string
}

export interface ICollectionItem extends ICollectionFields, Document {}
