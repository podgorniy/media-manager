import * as React from 'react'
import {App} from './components/App'
import {render} from 'react-dom'
import {fetchMedia} from './api'

async function main() {
    let res = await fetchMedia({
        limit: 6,
        skip: 20
    })
    console.log('res', res)
}

main()

render(<App />, document.getElementById('app'))
