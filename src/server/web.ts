import express = require('express')
import {initMiddleware} from './middleware'
import {initRoutes} from './routes'
import * as path from 'path'
import {connect} from 'mongoose'
import {MONGO_URL, WEB_PORT} from './env'
import {hashString} from './utils'
import {UserModel} from './models/user'
import {isDev} from '../common/lib'

async function createDefaultUser() {
    const DEFAULT_USERNAME = 'user'
    const DEFAULT_PASSWORD = '123'
    const defaultUser = await UserModel.findOne({name: DEFAULT_USERNAME})
    if (!defaultUser) {
        return new UserModel({
            name: DEFAULT_USERNAME,
            password: await hashString(DEFAULT_PASSWORD)
        }).save()
    }
}

export async function startServer() {
    const app = express()
    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname, '../', 'server-views'))
    await connect(
        MONGO_URL,
        // @ts-ignore
        {useNewUrlParser: true}
    )
    // Create user
    if (isDev()) {
        await createDefaultUser()
    }
    initMiddleware(app)
    initRoutes(app)
    app.listen(WEB_PORT)
    console.log(`App started at http://localhost:${WEB_PORT}`)
}
