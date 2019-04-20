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
            userName: loginRes.userName
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
}

export interface IFetchMediaHandler {
    response: Promise<IMediaResponse>
    cancel: Function
}

export function fetchMedia(params: IFetchMediaParams): IFetchMediaHandler {
    const {skip, limit, tags} = params
    const requestQueryParams: IProvideMediaParams = {
        limit: limit,
        skip: skip,
        tags: tags
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

export async function fetchTags(): Promise<{success: boolean; tags: Array<ITagsListItem>}> {
    const reqObj = await fetch(`/api/v1/tags`)
    return await reqObj.json()
}
