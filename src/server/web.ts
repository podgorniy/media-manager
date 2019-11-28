import express = require('express')
import {initMiddleware} from './middleware'
import {initRoutes} from './routes'
import * as path from 'path'
import {connect} from 'mongoose'
import {ACCOUNT_NAME, ACCOUNT_PASSWORD, DEMO, MONGO_URL, PORT} from './env'
import {createDemoUser, validateAndCreateMasterUser} from './user'

export async function startServer() {
    const app = express()
    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname, '../', 'server-views'))
    await connect(
        MONGO_URL,
        // @ts-ignore
        {useNewUrlParser: true}
    )
    let someAccountWasCreated = false
    if (DEMO) {
        await createDemoUser()
        someAccountWasCreated = true
    }
    if (ACCOUNT_NAME || ACCOUNT_PASSWORD) {
        await validateAndCreateMasterUser()
        someAccountWasCreated = true
    }
    if (!someAccountWasCreated) {
        throw Error(`No account created. Either specify DEMO env either provide ACCOUNT_NAME and ACCOUNT_PASSWORD`)
    }
    initMiddleware(app)
    initRoutes(app)
    app.listen(PORT)
    console.log(`Web server started on ${PORT} port`)
}
