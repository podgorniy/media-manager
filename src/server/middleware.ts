import * as express from 'express'
import {Express} from 'express'
import * as path from 'path'
import {isDev} from '../common/lib'
import {SESSION_SECRET} from './env'
import {configurePassport} from './passport'
import session = require('express-session')
import bodyParser = require('body-parser')

const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')
const MongoStore = connectMongo(session)

export function initMiddleware(app: Express) {
    app.use(express.static(path.resolve(__dirname, '../static')))
    app.use(
        session({
            secret: SESSION_SECRET,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                collection: 'sessions'
            }),
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: !isDev()
            }
        })
    )
    app.use(bodyParser.json())
    configurePassport(app)
}
