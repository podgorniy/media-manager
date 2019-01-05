import * as os from 'os'
import multer = require('multer')
import {getExtension} from 'mime';

function genRandomName(ext) {
    return Math.random().toString().split('.')[1] + '-' + Date.now() + '.' + ext
}

const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir())
    },
    filename(req, file, cb): void {
        const ext = getExtension(file.mimetype) // without dot
        cb(null, genRandomName(ext))
    }
})
export const uploader = multer({
    storage: multerDiskStorage
})