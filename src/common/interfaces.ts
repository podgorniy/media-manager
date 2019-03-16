// Keep .ts extension. Otherwise parcel bundler fails to find this file dependency
// TODO: try to rename to d.ts after parcel version update from 1.10.3

export interface IUserMediaItem {
    url: string
    tags: Array<string>
    uuid: string
    type: MediaType
}

export interface IAppInitialState {
    userName: string
    userMedia: Array<IUserMediaItem>
}

// Client side representation of media item
export interface IClientMediaItem extends IUserMediaItem {
    selected: boolean
}

export interface IMediaResponse {
    items: Array<IUserMediaItem>
    success: boolean
    hasMore: boolean
}

export interface IProvideMediaParams {
    skip?: number
    limit?: number
}

export type MediaType = 'img' | 'video'
