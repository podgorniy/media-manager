export interface IUserMediaItem {
    url: string
    tags: Array<string>
    fileName: string
}

export interface IAppInitialState {
    userName: string
    userMedia: Array<IUserMediaItem>
}

// Client side representation of media item
export interface IAppMediaItem extends IUserMediaItem {
    selected: boolean
}

export interface IMediaResponse {
    items: Array<IUserMediaItem>
}

export interface IProvideMediaParams {
    skip?: number
    limit?: number
}
