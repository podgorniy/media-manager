import {asyncHandler} from '../utils'
import {MediaModel} from '../media'

export const addTags = asyncHandler(async (req, res) => {
    const {tags, media} = req.body
    try {
        await MediaModel.updateMany(
            {
                uuid: {
                    $in: media
                },
                owner: req.user._id
            },
            {
                $addToSet: {
                    tags: {
                        $each: tags
                    }
                }
            }
        )
        res.send({
            success: true
        })
    } catch (err) {
        console.error(err)
        res.send({
            success: false
        })
    }
})
