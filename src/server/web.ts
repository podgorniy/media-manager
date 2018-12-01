import express = require('express')
import {initMiddleware} from './middleware'
import {initRoutes} from './routes'
import * as path from 'path'
import {connect} from 'mongoose'
require('./models/images')

const DEV_PORT = 8888

export async function startServer() {
    const app = express()
    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname, 'views'))
    await connect('mongodb://localhost/image-manager')
    initMiddleware(app)
    initRoutes(app)
    const appPort = process.env.PORT || DEV_PORT
    app.listen(appPort)
    console.log(`App started at ${appPort}`)
}
