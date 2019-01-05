import {RequestHandler} from 'express';
import * as path from 'path';
import {UPLOADS_DIR} from '../common/config';

export function asyncHandler(fn: RequestHandler) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function filePathForPersistence(fileName) {
    return path.join(UPLOADS_DIR, fileName)
}
