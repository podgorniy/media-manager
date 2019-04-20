import {asyncHandler, filePathForPersistence} from '../utils'
import {IMediaDoc, MediaModel} from '../media'
import * as path from 'path'
import {getExtension, getType} from 'mime'
import {MediaType} from '../../common/interfaces'

const md5file = require('md5-file/promise')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')

const KNOWN_TYPES = {
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
    return ['new', extension]
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
    const uuid = uuidv4()
    const fileExtensionWithDot = path.extname(sourcePath) // with dot
    const fileMimeType = getType(fileExtensionWithDot)
    const fileType = getTypeOfDoc(fileMimeType)
    const extension = getExtension(fileMimeType)
    const fileName = uuid + fileExtensionWithDot
    const fileTargetPath = filePathForPersistence(fileName)
    await fs.copy(sourcePath, fileTargetPath)
    const tags = getTags(extension)
    const docObj: IMediaDoc = {
        owner: ownerId,
        uuid: uuid,
        fileExtension: extension,
        md5: md5,
        type: fileType,
        tags: tags
    }
    const res = new MediaModel(docObj)
    await res.save()
    return res
}

export const upload = asyncHandler(async (req, res) => {
    let filesMongoDocs = await Promise.all(
        (req.files as Array<{path: string}>).map((file) => {
            return registerFile(file.path, req.user._id)
        })
    )
    res.json({
        success: true,
        files: filesMongoDocs
    })
})
