import {MediaType} from './interfaces'

export function isDev() {
    return process.env.NODE_ENV !== 'production'
}

export const KNOWN_TYPES = {
    img: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
    video: ['video/x-ms-wmv', 'video/x-msvideo', 'video/mp4', 'video/x-flv']
}
export function getTypeOfDoc(mimeType: string): MediaType {
    let i: MediaType
    for (i in KNOWN_TYPES) {
        if (KNOWN_TYPES[i].some((s) => s === mimeType)) {
            return i
        }
    }
    console.error(`Unknown mime type ${mimeType}`)
}
