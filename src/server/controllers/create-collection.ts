import { asyncHandler } from '../utils'
import { CollectionsModel } from '../collection'

export const createCollection = asyncHandler(async (req, res) => {
    const title = (req.body.title || '').trim()
    if (!title) {
        res.status(406).send({
            success: false
        })
        return
    }
    if (!req.user._id) {
        res.status(401).send({success: false})
        return
    }
    let uri
    let instanceWithThatUri
    do {
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        uri = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 6)
        instanceWithThatUri = await CollectionsModel.findOne({uri: uri})
    } while (instanceWithThatUri)
    const record = new CollectionsModel({
        uri: uri,
        media: [],
        public: false,
        title: title,
        owner: req.user._id
    })
    await record.save()
    res.send({
        success: true
    })
})
