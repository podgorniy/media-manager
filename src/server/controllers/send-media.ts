import {asyncHandler, filePathForPersistence, getExtension, getName} from '../utils'
import {getFileName, MediaModel} from '../media'

export const sendMedia = asyncHandler(async (req, res) => {
    let fileDoc
    const fileName = req.params.fileName
    const fileUUID = getName(fileName)
    const fileExtension = getExtension(fileName)

    fileDoc = await MediaModel.findOne({
        uuid: fileUUID,
        fileExtension: fileExtension,
        sharedIndividually: true
    })
    if (fileDoc) {
        res.sendFile(filePathForPersistence(getFileName(fileDoc)))
        return
    }
    const userId = req.user && req.user._id
    if (!userId) {
        res.status(404).send(`Not found or don't have permissions to view`)
        return
    }
    // not handled by type system
    fileDoc = await MediaModel.findOne({
        uuid: fileUUID,
        fileExtension: fileExtension,
        owner: req.user._id
    })
    if (!fileDoc) {
        res.status(404).send(`Not found or don't have permissions to view`)
        return
    }
    res.sendFile(filePathForPersistence(getFileName(fileDoc)))
})
