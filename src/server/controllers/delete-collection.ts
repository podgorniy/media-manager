import { asyncHandler } from '../utils'
import { CollectionsModel } from '../collection'

export const deleteCollection = asyncHandler(async (req, res) => {
    try {
        const collectionId = req.body.collectionId
        if (!req.user || !req.user._id) {
            res.status(401).send({
                success: false
            })
            return
        }
        const collectionSelector = {
            owner: req.user._id,
            _id: collectionId
        }
        const matchedCollection = await CollectionsModel.findOne(collectionSelector)
        if (!matchedCollection) {
            res.status(500).send({
                success: false
            })
            return
        }
        await CollectionsModel.deleteOne(collectionSelector)
        res.send({
            success: true
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({
            success: false
        })
    }
})
