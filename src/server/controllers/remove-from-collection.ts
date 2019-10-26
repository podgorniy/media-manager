import { asyncHandler } from '../utils'
import { CollectionsModel } from '../collection'

export const removeFromCollection = asyncHandler(async (req, res) => {
    try {
        if (!req.user._id) {
            res.status(401).send({
                success: false
            })
            return
        }
        const {collectionId, items} = req.body
        if (!collectionId || !items || !items.length) {
            res.status(400).send({
                success: false
            })
            return
        }
        const collectionSelector = {
            _id: collectionId,
            owner: req.user._id
        }
        const matchedCollection = await CollectionsModel.findOne(collectionSelector)
        if (!matchedCollection) {
            res.status(400).send({
                success: false
            })
            return
        }
        await CollectionsModel.updateOne(collectionSelector, {
            $pull: {
                media: {
                    $in: items
                }
            }
        })
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
