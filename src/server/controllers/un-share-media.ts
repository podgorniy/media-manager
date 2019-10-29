import {asyncHandler, SHARED_TAG} from '../utils'
import {MediaModel} from '../media'

export const unShareMedia = asyncHandler(async (req, res) => {
    const userId = req.user && req.user._id
    if (!userId) {
        res.status(401).json({success: false})
        return
    }
    const {uuid} = req.body
    const fileDoc = await MediaModel.findOne({
        uuid: uuid,
        owner: userId
    })
    if (!fileDoc) {
        res.status(406).json({success: false})
        return
    }
    await MediaModel.updateOne(
        {
            _id: fileDoc._id
        },
        {
            $set: {
                sharedIndividually: false
            },
            $pull: {
                tags: SHARED_TAG
            }
        }
    )
    res.json({success: true})
})
