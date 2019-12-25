import {Express} from 'express'
import {asyncHandler} from './utils'
import {upload} from './controllers/upload'
import {uploader} from './uploader'
import {sendMedia, sendPreview} from './controllers/send-media'
import {logout} from './controllers/logout'
import {check} from './controllers/check'
import {provideMedia} from './controllers/provide-media'
import {provideTags} from './controllers/provide-tags'
import {addTags} from './controllers/add-tags'
import {removeTags} from './controllers/remove-tags'
import {provideCollections} from './controllers/provide-collections'
import {addToCollection} from './controllers/add-to-collection'
import {createCollection} from './controllers/create-collection'
import {removeFromCollection} from './controllers/remove-from-collection'
import {deleteCollection} from './controllers/delete-collection'
import {renameCollection} from './controllers/rename-collection'
import {shareMedia} from './controllers/share-media'
import {unShareMedia} from './controllers/un-share-media'
import {shareCollection} from './controllers/share-collection'
import {unShareCollection} from './controllers/un-share-collection'
import {checkCollection} from './controllers/checkCollection'
import {updateCollection} from './controllers/update-collection'
import {UserModel} from './user'

const passport = require('passport')

// https://stackoverflow.com/a/47448486
// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUserFields
//         }
//
//         interface Response {
//             locals: {
//                 initialState: IAppInitialState
//             }
//         }
//     }
// }

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({
            success: false,
            reason: 'unauthorized'
        })
    }
}

export function initRoutes(app: Express) {
    app.post('/api/v1/login', passport.authenticate('local'), (req, res) => {
        res.send({
            success: true,
            userName: req.user.name
        })
    })
    app.post('/api/v1/logout', logout)
    app.post('/api/v1/upload', isAuthenticated, uploader.array('uploads'), upload)
    app.get('/api/v1/check', isAuthenticated, check)
    app.get('/api/v1/media', provideMedia)
    app.get('/api/v1/tags', isAuthenticated, provideTags)
    app.post('/api/v1/add-tags', isAuthenticated, addTags)
    app.patch('/api/v1/remove-tags', isAuthenticated, removeTags)
    app.get('/api/v1/collections', isAuthenticated, provideCollections)
    app.post('/api/v1/create-collection', isAuthenticated, createCollection)
    app.post('/api/v1/rename-collection', isAuthenticated, renameCollection)
    app.post('/api/v1/delete-collection', isAuthenticated, deleteCollection)
    app.post('/api/v1/add-to-collection', isAuthenticated, addToCollection)
    app.post('/api/v1/remove-from-collection', isAuthenticated, removeFromCollection)
    app.post('/api/v1/update-collection', isAuthenticated, updateCollection)
    app.post('/api/v1/share-media', isAuthenticated, shareMedia)
    app.post('/api/v1/un-share-media', isAuthenticated, unShareMedia)
    app.post('/api/v1/share-collection', isAuthenticated, shareCollection)
    app.post('/api/v1/un-share-collection', isAuthenticated, unShareCollection)
    app.get('/api/v1/check-collection', checkCollection)
    app.get('/m/:fileName', sendMedia)
    app.get('/p/:fileName', sendPreview)
    app.get(
        '*',
        asyncHandler(async (req, res) => {
            res.locals.title = 'Media Manager'
            res.locals.isAuthenticated = !!req.user
            res.locals.hasDemoAccount = !!(await UserModel.findOne({name: 'demo'}))
            res.render('default')
        })
    )
}
