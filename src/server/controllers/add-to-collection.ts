import {asyncHandler} from '../utils'
import {CollectionsModel} from '../collection'

export const addToCollection = asyncHandler(async (req, res) => {
    const {collectionId, items} = req.body
    await CollectionsModel.updateOne(
        {
            _id: collectionId,
            owner: req.user._id
        },
        {
            $addToSet: {
                media: items
            }
        }
    )
    res.send({
        success: false
    })
})
