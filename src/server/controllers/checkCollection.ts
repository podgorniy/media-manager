import {asyncHandler} from '../utils'
import {CollectionsModel} from '../collection'

export const checkCollection = asyncHandler(async (req, res) => {
    const {uri, password} = req.query
    const matchedCollection = await CollectionsModel.findOne({
        uri: uri
    })
    if (!matchedCollection) {
        res.send({
            success: true,
            exists: false
        })
    } else {
        res.send({
            success: true,
            exists: true,
            passwordProtected: !!matchedCollection.publicPassword,
            passwordIsValid: matchedCollection.publicPassword === password
        })
    }
})
