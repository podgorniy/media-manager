import { asyncHandler } from '../utils'
import { CollectionsModel } from '../collection'

export const renameCollection = asyncHandler(async (req, res) => {
    const title = (req.body.title || '').trim()
    const _id = req.body.collectionId
    if (!title || !_id) {
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
            $set: {title: title}
        })
    } else {
        res.status(406).send({
            success: false
        })
        return
    }
    res.send({
        success: true
    })
})
