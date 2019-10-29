import {asyncHandler} from '../utils'
import {MediaModel} from '../media'
import {ITagsListItem} from '../../common/interfaces'
import {CollectionsModel} from '../collection'

export const provideTags = asyncHandler(async (req, res) => {
    try {
        const {collectionId} = req.query
        let tagsSet = new Set<string>()
        let queryMedia = {
            owner: req.user._id
        }
        if (collectionId) {
            const matchedCollection = await CollectionsModel.findOne({_id: collectionId})
            if (!matchedCollection) {
                res.status(500).send({success: false})
                return
            }
            queryMedia['uuid'] = {
                $in: matchedCollection.media
            }
        }
        await MediaModel.find(queryMedia)
            .cursor()
            .eachAsync((mediaItem) => {
                let tagsList = mediaItem.tags
                for (let i = 0; i < tagsList.length; i += 1) {
                    tagsSet.add(tagsList[i])
                }
            })
        let tagsArr = Array.from(tagsSet)
        tagsArr.sort()
        let responseData: Array<ITagsListItem>
        responseData = tagsArr.map<ITagsListItem>((tagName) => {
            return {
                name: tagName
            }
        })
        res.send({
            success: true,
            tags: responseData
        })
    } catch (err) {
        res.send({
            success: false
        })
        console.error(err)
    }
})
