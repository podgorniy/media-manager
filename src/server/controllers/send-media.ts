import {asyncHandler, filePathForPersistence} from '../utils';
import {MediaModel} from '../models/media';

export const sendMedia = asyncHandler(async (req, res) => {
    const userId = req.user && req.user._id
    if (!userId) {
        res.status(404).send(`Not found or don't have permissions to view`)
        return
    }
    const fileName = req.params.fileName
    const fileDoc = await MediaModel.findOne({
        fileName: fileName,
        owner: req.user._id
    })
    if (!fileDoc) {
        res.status(404).send(`Not found or don't have permissions to view`)
        return
    }
    res.sendFile(filePathForPersistence(fileName))
})