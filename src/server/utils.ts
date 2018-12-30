import {RequestHandler} from 'express';

export function asyncHandler(fn: RequestHandler) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}
