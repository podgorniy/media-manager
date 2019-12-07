import {asyncHandler, getFilePathForPersistence, THUMBNAILS_FOLDER_PATH} from '../utils'
import {IMediaDoc, MediaModel} from '../media'
import * as path from 'path'
import {getExtension, getType} from 'mime'
import {MediaType} from '../../common/interfaces'
import {ffprobe} from 'fluent-ffmpeg'
import {promisify} from 'util'
import sizeOf = require('image-size')
import sharp = require('sharp')

const md5file = require('md5-file/promise')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')

const KNOWN_TYPES: {[key in MediaType]: Array<string>} = {
    img: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
    video: ['video/x-ms-wmv', 'video/x-msvideo', 'video/mp4', 'video/x-flv']
}

function getTypeOfDoc(mimeType: string): MediaType {
    let i: MediaType
    for (i in KNOWN_TYPES) {
        if (KNOWN_TYPES[i].some((s) => s === mimeType)) {
            return i
        }
    }
    console.error(`Unknown mime type ${mimeType}`)
}

function getTags(extension: string): Array<string> {
    let tags = ['new']
    if (['gif', 'mp4'].indexOf(extension) !== -1) {
        tags.push('animation')
    }
    tags.push(extension)
    return tags
}

// Returns mongo doc of corresponding file
async function registerFile(sourcePath: string, ownerId: string) {
    const md5 = await md5file(sourcePath)
    const sameFileForCurrentUser = await MediaModel.findOne({
        owner: ownerId,
        md5: md5
    })
    if (sameFileForCurrentUser) {
        return sameFileForCurrentUser
    }
    const uuid = uuidv4().replace(/-/g, '')
    const fileExtensionWithDot = path.extname(sourcePath) // with dot
    const fileMimeType = getType(fileExtensionWithDot)
    const fileType = getTypeOfDoc(fileMimeType)
    const extension = getExtension(fileMimeType)
    const fileName = uuid + fileExtensionWithDot
    const fileTargetPath = getFilePathForPersistence(fileName, 'upload')
    let mediaSize: {width: number; height: number} = {
        width: 0,
        height: 0
    }
    let shouldHavePreview = false
    await fs.copy(sourcePath, fileTargetPath)
    if (fileType === 'img') {
        const size = sizeOf(sourcePath)
        mediaSize.width = size.width
        mediaSize.height = size.height
        shouldHavePreview = (mediaSize.width > THUMBNAIL_WIDTH) || (extension === 'gif')
        const previewFilePath = path.resolve(THUMBNAILS_FOLDER_PATH, uuid + '.jpeg')
        if (shouldHavePreview) {
            await generateThumbnail({sourceFilePath: fileTargetPath, thumbnailFilePath: previewFilePath})
        }
    } else if (fileType === 'video') {
        // @ts-ignore
        const videoMetaInfo = await promisify(ffprobe)(sourcePath)
        const {width, height} = videoMetaInfo.streams[0]
        mediaSize.width = width
        mediaSize.height = height
    }
    // Thumbnails are always jpeg
    // const thumbnailTargetFilePath = getThumbnailFilePath({uuid: uuid, fileType: fileType, fileTargetPath: fileTargetPath})
    const tags = getTags(extension)
    const docObj: IMediaDoc = {
        owner: ownerId,
        uuid: uuid,
        fileExtension: extension,
        md5: md5,
        type: fileType,
        tags: tags,
        sharedIndividually: false,
        width: mediaSize.width,
        height: mediaSize.height,
        hasPreview: shouldHavePreview
    }
    const res = new MediaModel(docObj)
    await res.save()
    return res
}

interface IGenerateThumbnailParams {
    sourceFilePath: string
    thumbnailFilePath: string
}

const THUMBNAIL_WIDTH = 350

async function generateThumbnail(params: IGenerateThumbnailParams) {
    const {sourceFilePath, thumbnailFilePath} = params
    return sharp(sourceFilePath)
        .resize(THUMBNAIL_WIDTH)
        .toFile(thumbnailFilePath)
}

export const upload = asyncHandler(async (req, res) => {
    try {
        let filesMongoDocs = await Promise.all(
            (req.files as Array<{path: string}>).map((file) => {
                return registerFile(file.path, req.user._id)
            })
        )
        res.json({
            success: true,
            files: filesMongoDocs
        })
    } catch (error) {
        res.json({
            success: false,
            reason: error.toString()
        })
    }
})
