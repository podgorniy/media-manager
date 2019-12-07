import {RequestHandler} from 'express'
import * as path from 'path'
import {FILES_DIR} from './env'
import {compare, hash} from 'bcrypt'

export const SHARED_TAG = 'shared'

export function asyncHandler(fn: RequestHandler) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function getFolderPathForPersistence(subdirPath = '') {
    return path.resolve(path.join(FILES_DIR, subdirPath))
}

export function getFilePathForPersistence(fileName, subDirPath = '') {
    let folderPath = getFolderPathForPersistence(subDirPath)
    return path.resolve(folderPath, fileName)
}

export const MEDIA_FOLDER_PATH = getFolderPathForPersistence('upload')
export const THUMBNAILS_FOLDER_PATH = getFolderPathForPersistence('preview')

export async function hashString(password) {
    return hash(password, 10)
}

export async function compareHashed(str, hash) {
    return compare(str, hash)
}

export function trimDot(s: string): string {
    return s.replace(/(^\.*)|(\.*$)/g, '')
}

export function getName(fileName: string): string {
    let sections = fileName.split('.')
    sections.pop()
    if (!sections.length) {
        throw Error(`Failed to extract name from fileName ${fileName}`)
    }
    return sections.join('.')
}

export function getExtension(fileName: string): string {
    let sections = fileName.split('.')
    if (sections.length === 1) {
        throw Error(`Failed to extract extension from fileName ${fileName}`)
    }
    return sections[sections.length - 1]
}
