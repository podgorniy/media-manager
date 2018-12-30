import {Express} from 'express'
import {IUserFields} from './models/user';
import {asyncHandler} from './utils';
import {upload} from './controllers/upload';
import {uploader} from './uploader';
const passport = require('passport')

// https://stackoverflow.com/a/47448486
declare global {
    namespace Express {
        interface Request {
            user: IUserFields
        }
    }
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res
            .status(401)
            .json({
                success: false,
                reason: 'unauthorized'
            })
    }
}

export function initRoutes(app: Express) {
    app.post('/api/v1/login', passport.authenticate('local'), (req, res) => {
        res.redirect('/')
    })

    app.post('/api/v1/logout', (req, res) => {
        req.logout()
        res.json({
            success: true
        })
    })

    // app.post('/api/v1/upload', isAuthenticated, uploader.array('uploads'), upload)
    app.post('/api/v1/upload', uploader.array('uploads'), upload)

    app.get('/api/v1/check', isAuthenticated, (req, res) => {
        res.json({
            user: req.user
        })
    })

    app.get('*', asyncHandler(async (req, res) => {
        req.session.visits = (req.session.visits || 0) + 1
        res.locals.visits = req.session.visits
        res.locals.isLoggedIn = !!req.user
        res.render('default')
    }))
}
