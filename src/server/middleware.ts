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
    app.use((req, res, next) => {
        if (isDev()) {
            setTimeout(next, Math.random() * 999 + 500) // 500 - 1500ms of delay
        } else {
            next()
        }
    })
    app.use(
        session({
            secret: SESSION_SECRET,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                collection: 'sessions'
            }),
            resave: true,
            saveUninitialized: false,
            cookie: {
                // TODO: figure out
                // secure: !isDev()
                secure: false
            }
        })
    )
    app.use(bodyParser.json())
    configurePassport(app)
}
