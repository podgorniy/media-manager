import { asyncHandler } from '../utils'
import { MediaModel } from '../media'

export const removeTags = asyncHandler(async (req, res) => {
    const {tags, media} = req.body
    try {
        await MediaModel.updateMany(
            {
                uuid: {
                    $in: media
                }
            },
            {
                $pull: {
                    tags: {
                        $in: tags
                    }
                }
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send({
            success: false
        })
    }
    res.send({
        success: true
    })
})
