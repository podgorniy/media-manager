import * as os from 'os'
import multer = require('multer')

const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir())
    },
    filename(req, file, cb): void {
        // console.log(file) // TODO: generate proper filename with extension
        cb(null, Math.random().toString().split('.')[1] + '-' + Date.now())
    }
})
export const uploader = multer({
    storage: multerDiskStorage
})