import {asyncHandler} from '../utils'
import {CollectionsModel} from '../collection'

export const provideCollections = asyncHandler(async (req, res) => {
    if (!req.user._id) {
        res.status(401).send({success: false})
        return
    }

    res.send({
        success: true,
        collections: await CollectionsModel.find({
            owner: req.user._id
        })
    })
})
