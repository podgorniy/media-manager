require('./client.less')
import {isDev} from '../common/lib'

async function main() {
    const resp = await fetch('/api/v1/check')
    const respJSON = await resp.json()
    console.log(`respJSON`, respJSON)
}

if (isDev()) {
    main()
    console.log('Welcome dev')
} else {
    console.log('Welcome user')
}
