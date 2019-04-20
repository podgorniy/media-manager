import {asyncHandler} from '../utils'
import {MediaModel} from '../media'
import {ITagsListItem} from '../../common/interfaces'

export const provideTags = asyncHandler(async (req, res) => {
    try {
        let tagsSet = new Set()
        await MediaModel.find({
            owner: req.user._id
        })
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
        responseData = tagsArr.map((tagName) => {
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
