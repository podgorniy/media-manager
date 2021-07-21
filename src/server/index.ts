require('dotenv').config()
require('source-map-support').install()
import * as fs from 'fs-extra'
import {MEDIA_FOLDER_PATH, THUMBNAILS_FOLDER_PATH} from './utils'
import {startServer} from './web'

fs.ensureDirSync(MEDIA_FOLDER_PATH)
fs.ensureDirSync(THUMBNAILS_FOLDER_PATH)

startServer().then(() => {
    console.log('Server started')
}).catch((err) => {
    console.error(err)
})
