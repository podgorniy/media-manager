import { asyncHandler, filePathForPersistence, getExtension, getName } from '../utils'
import { getFileName, MediaModel } from '../media'
import { CollectionsModel } from '../collection'
import { getPathSegments } from '../../common/lib'

const urlParse = require('url-parse')

export const sendMedia = asyncHandler(async (req, res) => {
    const fileName = req.params.fileName
    const fileUUID = getName(fileName)
    const fileExtension = getExtension(fileName)
    const refererUrl = req.headers.referer || ''
    const parsedReferred = urlParse(refererUrl)
    const pathSegments = getPathSegments(parsedReferred.pathname)
    const [_, refererCollectionUri] = pathSegments
    const matchedDoc = await MediaModel.findOne({
        uuid: fileUUID,
        fileExtension: fileExtension
    })
    if (!matchedDoc) {
        return res.status(404).send(`Not found or don't have permissions to view`)
    } else {
        let sharedCollectionsWithThisDoc = await CollectionsModel.findOne({
            media: matchedDoc.uuid,
            uri: refererCollectionUri,
            public: true
        })
        const mediaIsSharedIndividually = matchedDoc.sharedIndividually
        const mediaBelongsToRequestedSharedCollection = !!sharedCollectionsWithThisDoc
        const mediaBelongsToAuthenticatedUser = req.isAuthenticated() && req.user._id.toString() === matchedDoc.owner
        if (mediaIsSharedIndividually || mediaBelongsToRequestedSharedCollection || mediaBelongsToAuthenticatedUser) {
            return res.sendFile(filePathForPersistence(getFileName(matchedDoc)))
        } else {
            return res.status(404).send(`Not found or don't have permissions to view`)
        }
    }
})
