import {mediaTypes} from './interfaces'

export function isDev() {
    return process.env.NODE_ENV !== 'production'
}

export function getType(url: string): mediaTypes {
    if (/mp4|qt/.test(url)) {
        return 'video'
    } else {
        return 'img'
    }
}
