const shell = require('shelljs')
const path = require('path')

// Add node_modules/.bin to path as it's not included by default
shell.env['PATH'] += path.delimiter + path.join(process.cwd(), 'node_modules', '.bin')
shell.env['NODE_ENV'] = 'development'
shell.env['FILES_DIR'] = './data/files'

shell.mkdir('-p', './.dev/server/')
shell.touch('./.dev/server/index.js')
shell.exec(
    `concurrently ${[
        '"tsc --watch --project ./src/server/tsconfig.dev.json"',
        '"nodemon -w ./.dev/server -w ./.dev/server-views ./.dev/server/index.js"',
        '"sync-files --no-notify-update --watch ./src/static ./.dev/static"',
        '"sync-files --watch ./src/server-views ./.dev/server-views"',
        '"parcel watch --cache-dir ./.dev/.cache ./src/client/client.tsx --out-dir ./.dev/static/client --public-url /client/"'
    ].join(' ')}`
)
