import {asyncHandler} from '../utils'
import {CollectionsModel} from '../collection'

const allowedKeysToUpdate = ['public', 'publicPassword']

export const updateCollection = asyncHandler(async (req, res) => {
    const userId = req.user && req.user._id
    if (!userId) {
        res.status(401).json({success: false})
        return
    }
    const {uri} = req.body
    const collection = await CollectionsModel.findOne({
        uri: uri,
        owner: userId
    })
    if (!collection) {
        res.status(406).json({success: false})
        return
    }
    const newValuesKeys = Object.keys(req.body).filter((requestKey) => {
        return allowedKeysToUpdate.indexOf(requestKey) !== -1
    })
    let newValues = newValuesKeys.reduce((res, key) => {
        res[key] = req.body[key]
        return res
    }, {})
    await CollectionsModel.updateOne(
        {
            _id: collection._id
        },
        {
            $set: newValues
        }
    )
    res.json({success: true})
})
