import {Express} from 'express'
import {isDev} from '../common/lib'
import * as express from 'express'

const Bundler = require('parcel-bundler')

export function initMiddleware(app: Express) {
    const bundler = new Bundler('./src/client/index.ts', {
        outDir: 'static/dist',
        publicUrl: '/dist',
        contentHash: false,
        sourceMaps: isDev()
    })
    app.use(bundler.middleware())
    app.use(express.static('static'))
}
