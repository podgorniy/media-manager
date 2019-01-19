import {Express} from 'express'
import {isDev} from '../common/lib'
import * as express from 'express'
import session = require('express-session')
import {SESSION_SECRET} from './env'
import {configurePassport} from './passport'
import bodyParser = require('body-parser')

const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')
const Bundler = require('parcel-bundler')
const MongoStore = connectMongo(session)

export function initMiddleware(app: Express) {
    const bundler = new Bundler('./src/client/index.tsx', {
        outDir: 'static/client',
        publicUrl: '/client',
        contentHash: false,
        sourceMaps: isDev()
    })
    app.use(bundler.middleware())
    app.use(express.static('static'))
    app.use(session({
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
    }))
    app.use(bodyParser.json())
    configurePassport(app)
}
