import { asyncHandler } from '../utils'
import { CollectionsModel } from '../collection'

export const unShareCollection = asyncHandler(async (req, res) => {
    const _id = req.body.collectionId
    if (!_id) {
        res.status(406).send({
            success: false
        })
        return
    }
    if (!req.user._id) {
        res.status(401).send({success: false})
        return
    }
    const collectionQuery = {
        owner: req.user._id,
        _id: _id
    }
    const matchedCollection = await CollectionsModel.findOne(collectionQuery)
    if (matchedCollection) {
        await CollectionsModel.updateOne(collectionQuery, {
            $set: {public: false}
        })
        res.send({
            success: true
        })
    } else {
        res.status(406).send({
            success: false
        })
        return
    }
})
