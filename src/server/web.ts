import express = require('express')
import { initMiddleware } from './middleware'
import { initRoutes } from './routes'
import * as path from 'path'
import { connect } from 'mongoose'
import { MONGO_URL, WEB_PORT } from './env'

export async function startServer() {
    const app = express()
    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname, '../', 'server-views'))
    await connect(
        MONGO_URL,
        // @ts-ignore
        {useNewUrlParser: true}
    )
    initMiddleware(app)
    initRoutes(app)
    app.listen(WEB_PORT)
    console.log(`App started at http://localhost:${WEB_PORT}`)
}
