import {asyncHandler} from '../utils'
import {IMediaResponse} from '../../common/interfaces'
import {MediaModel, toClientSideRepresentation} from '../media'
import {IUserFields} from '../user'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export const provideMedia = asyncHandler(async (req, res) => {
    try {
        const {skip, limit} = req.query
        const intLimit = parseInt(limit)
        const normalizedCount = !intLimit || intLimit <= 0 ? DEFAULT_LIMIT : intLimit
        const querySkipItems = parseInt(skip) || 0
        const queryLimitItems = normalizedCount > MAX_LIMIT ? MAX_LIMIT : normalizedCount
        const query = {
            owner: (req.user as IUserFields)._id
        }
        const itemsCountForQuery = await MediaModel.find(query).count()
        const canProvideMoreItems = querySkipItems + queryLimitItems < itemsCountForQuery
        const userMediaItems = await MediaModel.find(query, null, {
            skip: querySkipItems,
            limit: queryLimitItems
        })
        const respData: IMediaResponse = {
            items: userMediaItems.map(toClientSideRepresentation),
            success: true,
            hasMore: canProvideMoreItems
        }
        res.send(respData)
    } catch (err) {
        res.send({
            success: false
        })
        console.error(err)
    }
})
