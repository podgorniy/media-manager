import {Express} from 'express';

function asyncHandler(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function initRoutes(app: Express) {
    app.get('*', asyncHandler(async (req, res) => {
        res.render('default')
    }))
}
