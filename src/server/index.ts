require('dotenv').config()
require('source-map-support').install()
import {startServer} from './web'

startServer().catch((err) => {
    console.error(err)
})
