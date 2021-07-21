const shell = require('shelljs')
const path = require('path')

// Add node_modules/.bin to path as it's not included by default
shell.env['PATH'] += path.delimiter + path.join(process.cwd(), 'node_modules', '.bin')
shell.env['NODE_ENV'] = 'production'

shell.rm('-rf', './dist/**')
shell.exec('tsc --project ./src/server/tsconfig.json')
shell.exec('sync-files --no-notify-update ./src/server-views ./dist/server-views')
shell.exec('sync-files --no-notify-update ./src/static ./dist/static')
shell.exec('parcel build --no-cache ./src/client/client.tsx --out-dir ./dist/static/client  --public-url /client/')
