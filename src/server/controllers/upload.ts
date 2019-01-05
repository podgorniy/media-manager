import {asyncHandler, filePathForPersistence} from '../utils'
import {MediaModel} from '../models/media';
import * as path from 'path';

const md5file = require('md5-file/promise')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')

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
    const fileExtension = path.extname(sourcePath) // with dot
    const fileName = uuid + fileExtension
    const fileTargetPath = filePathForPersistence(fileName)
    await fs.copy(sourcePath, fileTargetPath)
    const res = new MediaModel({
        owner: ownerId,
        fileName: fileName,
        md5: md5
    })
    await res.save()
    return res
}

export const upload = asyncHandler(async (req, res) => {
    let filesMongoDocs = await Promise.all((req.files as Array<{path: string}>).map((file) => {
        return registerFile(file.path, req.user._id)
    }))
    res.json({
        success: true,
        files: filesMongoDocs
    })
})
