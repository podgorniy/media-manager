export interface IUserMediaItem {
    url: string
    tags: Array<string>
    fileName: string
}

export interface IAppInitialState {
    userName: string
    userMedia: Array<IUserMediaItem>
}
