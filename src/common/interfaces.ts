export interface IUserMediaItem {
    url: string
    tags: Array<string>
    fileName: string
}

export interface IInitialState {
    userName: string
    userMedia: Array<IUserMediaItem>
}
