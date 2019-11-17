import {IMediaResponse, IProvideMediaParams, ITagsListItem} from '../common/interfaces'
import {stringify} from 'qs'

const axios = require('axios')

export async function logout() {
    const logoutRespObj = await fetch('/api/v1/logout', {
        method: 'POST'
    })
    const logoutRes = await logoutRespObj.json()
    return logoutRes.success
}

export async function authenticate({userName, password}): Promise<{userName?: string; success: boolean}> {
    const loginRequestObj = await fetch('/api/v1/login', {
        method: 'POST',
        // https://stackoverflow.com/a/29823632
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: userName,
            password
        })
    })
    const loginRes = await loginRequestObj.json()
    if (loginRes.success) {
        return {
            success: true,
        }
    } else {
        return {
            success: false
        }
    }
}

interface IFetchMediaParams {
    skip?: number
    limit?: number
    tags?: Array<string>
    collectionUri?: string
}

export interface IFetchMediaHandler {
    response: Promise<IMediaResponse>
    cancel: Function
}

export function fetchMedia(params: IFetchMediaParams): IFetchMediaHandler {
    const {skip, limit, tags, collectionUri} = params
    const requestQueryParams: IProvideMediaParams = {
        limit: limit,
        skip: skip,
        tags: tags,
        collectionUri: collectionUri
    }
    let cancel
    const cancelToken = new axios.CancelToken((c) => {
        cancel = c
    })
    return {
        response: new Promise(async (resolve, reject) => {
            try {
                let res = await axios.get(`/api/v1/media?${stringify(requestQueryParams)}`, {
                    cancelToken: cancelToken
                })
                resolve(res.data)
            } catch (err) {
                reject(err)
            }
        }),
        cancel: cancel
    }
}

export async function fetchTags(params): Promise<{success: boolean; tags: Array<ITagsListItem>}> {
    const reqObj = await axios({
        method: 'GET',
        url: '/api/v1/tags',
        params: params
    })
    return reqObj.data
}

export async function addTags(tagsList: Array<string>, mediaUUIDs: Array<string>) {
    try {
        await axios({
            method: 'POST',
            url: '/api/v1/add-tags',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                tags: tagsList,
                media: mediaUUIDs
            })
        })
    } catch (err) {
        console.error(err)
    }
}

export async function removeTags(params: {tags: Array<string>; media: Array<string>}) {
    try {
        await axios({
            method: 'patch',
            url: '/api/v1/remove-tags',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                tags: params.tags,
                media: params.media
            })
        })
    } catch (err) {
        console.error(err)
    }
}

export async function getCollections(): Promise<Array<{uri: string; title: string}>> {
    try {
        const resp = await axios({
            method: 'get',
            url: '/api/v1/collections',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (resp.data.success && resp.data.collections) {
            return resp.data.collections
        } else {
            console.error('Failed to fetch collections')
            return []
        }
    } catch (err) {
        console.error(err)
    }
}

export async function createCollection(title): Promise<boolean> {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/create-collection',
            data: {
                title: title
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function addToCollection({collectionId, items}): Promise<boolean> {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/add-to-collection',
            data: {
                collectionId,
                items
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function removeFromCollection({collectionId, items}): Promise<boolean> {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/remove-from-collection',
            data: {
                collectionId,
                items
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function deleteCollection({collectionId}): Promise<boolean> {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/delete-collection',
            data: {
                collectionId
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function renameCollection({collectionId, newTitle}): Promise<boolean> {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/rename-collection',
            data: {
                collectionId: collectionId,
                title: newTitle
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function shareMedia({uuid}) {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/share-media',
            data: {
                uuid: uuid
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function unShareMedia({uuid}) {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/un-share-media',
            data: {
                uuid: uuid
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function shareCollection({id}) {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/share-collection',
            data: {
                collectionId: id
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function unShareCollection({id}) {
    try {
        const resp = await axios({
            method: 'post',
            url: '/api/v1/un-share-collection',
            data: {
                collectionId: id
            }
        })
        return resp.data.success || false
    } catch (err) {
        console.error(err)
        return false
    }
}

interface ICheckCollectionParams {
    uri: string
    password?: string
}

export interface ICheckCollectionValidResult {
    success: boolean
    exists: boolean
    passwordProtected: boolean
    passwordIsValid: boolean
}

export type ICheckCollectionResult = ICheckCollectionValidResult | false

export async function checkCollection({uri, password}: ICheckCollectionParams): Promise<ICheckCollectionResult> {
    try {
        const resp: {
            data: ICheckCollectionValidResult
        } = await axios({
            method: 'get',
            url: '/api/v1/check-collection',
            params: {
                uri: uri,
                password: password
            }
        })
        return resp.data
    } catch (err) {
        console.error(err)
        return false
    }
}

export interface IUpdateCollectionParams {
    uri: string
    public?: boolean
    publicPassword?: string
}

export async function updateCollection(params: IUpdateCollectionParams): Promise<boolean> {
    try {
        const resp: {
            data: {success: boolean}
        } = await axios({
            method: 'post',
            url: '/api/v1/update-collection',
            data: params
        })
        return resp.data.success
    } catch (err) {
        console.error(err)
        return false
    }
}
