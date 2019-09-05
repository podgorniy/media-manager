import {asyncHandler} from '../utils'
import {IMediaResponse} from '../../common/interfaces'
import {MediaModel, toApiRepresentation} from '../media'
import {IUserFields} from '../user'
import {CollectionsModel} from '../collection'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export const provideMedia = asyncHandler(async (req, res) => {
    try {
        const {skip, limit, tags, collectionUri} = req.query
        const intLimit = parseInt(limit)
        const normalizedCount = !intLimit || intLimit <= 0 ? DEFAULT_LIMIT : intLimit
        const querySkipItems = parseInt(skip) || 0
        const isAuthenticated = req.isAuthenticated()
        let queryLimitItems
        if (normalizedCount > MAX_LIMIT) {
            // impose max limit rule for non-authenticated users only
            queryLimitItems = isAuthenticated ? normalizedCount : MAX_LIMIT
        } else {
            queryLimitItems = normalizedCount
        }
        const query: {
            tags?: object
            owner?: object
            _id?: object
            uuid?: object
        } = {}

        if (req.isAuthenticated()) {
            query.owner = (req.user as IUserFields)._id
        }

        if (tags && tags.length) {
            query.tags = {$all: tags}
        }
        if (collectionUri) {
            let matchingCollection = await CollectionsModel.findOne({uri: collectionUri})
            if (!matchingCollection) {
                res.send({
                    success: false,
                    items: []
                })
                return
            }
            // non public collections are visible to owners only
            if (!matchingCollection.public && !req.isAuthenticated()) {
                res.send({
                    success: false,
                    items: []
                })
                return
            }
            query.uuid = {
                $in: matchingCollection.media
            }
        }
        const itemsCountForQuery = await MediaModel.find(query).count()
        const canProvideMoreItems = querySkipItems + queryLimitItems < itemsCountForQuery
        const userMediaItems = await MediaModel.find(query, null, {
            skip: querySkipItems,
            limit: queryLimitItems
        })
        const respData: IMediaResponse = {
            items: userMediaItems.map(toApiRepresentation),
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
