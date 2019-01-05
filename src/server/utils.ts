import {RequestHandler} from 'express';
import * as path from 'path';
import {UPLOADS_DIR} from '../common/config';
import {compare, hash} from 'bcrypt';

export function asyncHandler(fn: RequestHandler) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export function filePathForPersistence(fileName) {
    return path.join(UPLOADS_DIR, fileName)
}

export async function hashString(password) {
    return hash(password, 10)
}

export async function compareHashed(str, hash) {
    return compare(str, hash)
}