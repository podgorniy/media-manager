import {Express} from 'express'
const passport = require('passport')

function asyncHandler(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function initRoutes(app: Express) {
    app.post('/api/v1/login', passport.authenticate('local'), (req, res) => {
        res.redirect('/')
    })

    app.get('/api/v1/check', (req, res) => {
        res.json({
            user: req.user
        })
    })

    app.get('*', asyncHandler(async (req, res) => {
        req.session.visits = (req.session.visits || 0) + 1
        res.locals.visits = req.session.visits
        res.render('default')
    }))
}
