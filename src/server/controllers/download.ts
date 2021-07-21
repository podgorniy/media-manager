import {asyncHandler, getFilePathForPersistence} from '../utils'
import {CollectionsModel} from '../collection'
import {getFileName, MediaModel} from '../media'

export const download = asyncHandler(async (req, res) => {
    let uuids = req.body.uuids
    const collectionId = req.body.collectionId
    let downloadFileName = 'media'
    const userId = req.user._id
    if (!userId) {
        res.status(400).send('Must be authenticated')
        return
    }
    if (collectionId) {
        const collection = await CollectionsModel.findOne({
            owner: userId,
            _id: collectionId
        })
        if (!collection) {
            res.status(400).send('Collection not found')
            return
        }
        uuids = collection.media
        downloadFileName = collection.title
    }
    if (!uuids) {
        res.status(400).send('No items for download')
        return
    }
    const mediaForDownloading = await MediaModel.find({
        owner: userId,
        uuid: {
            $in: uuids
        }
    })
    const filesToZipReply = mediaForDownloading.map((m) => {
        const fileName = getFileName(m)
        return {
            path: getFilePathForPersistence(fileName, 'upload'),
            name: fileName
        }
    })
    // @ts-ignore
    res.zip(filesToZipReply, downloadFileName + '.zip')
})
