import {asyncHandler} from '../utils'
import {IMediaResponse, IProvideMediaParams} from '../../common/interfaces'
import {MediaModel} from '../media'
import {IUserFields} from '../user'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export const provideMedia = asyncHandler(async (req, res) => {
    const {skip, limit} = req.query
    const intLimit = parseInt(limit)
    const normalizedCount = !intLimit || intLimit <= 0 ? DEFAULT_LIMIT : intLimit
    const normalizedSkip = parseInt(skip) || 0
    const user = req.user as IUserFields

    const userMediaItems = await MediaModel.find(
        {
            owner: user._id
        },
        null,
        {
            skip: normalizedSkip,
            limit: normalizedCount > MAX_LIMIT ? MAX_LIMIT : normalizedCount
        }
    )

    const respData: IMediaResponse = {
        items: userMediaItems.map(({tags, fileName}) => {
            return {
                tags,
                fileName,
                url: `/m/${fileName}`
            }
        })
    }
    res.send(respData)
})
