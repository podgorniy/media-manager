import {Express} from 'express';

function asyncHandler(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function initRoutes(app: Express) {
    app.get('*', asyncHandler(async (req, res) => {
        req.session.visits = (req.session.visits || 0) + 1
        res.locals.visits = req.session.visits
        res.render('default')
    }))
}
