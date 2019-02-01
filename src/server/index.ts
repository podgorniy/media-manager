require('dotenv').config()
import {startServer} from './web'

startServer().catch((err) => {
    console.error(err)
})
