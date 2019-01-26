import * as React from 'react'
import {isDev} from '../common/lib'
import {App} from './App'
import {render} from 'react-dom'

require('./client.less')

async function main() {
    const resp = await fetch('/api/v1/check')
    const respJSON = await resp.json()
    console.log(`/api/v1/check`, respJSON)
}

render(<App />, document.getElementById('app'))

if (isDev()) {
    main()
    console.log('Welcome dev')
} else {
    console.log('Welcome user')
}

const logoutButton = document.querySelector('.logout')
if (logoutButton) {
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const logoutRespObj = await fetch('/api/v1/logout', {
            method: 'POST'
        })
        const logoutRes = await logoutRespObj.json()
        console.log('logoutRes', logoutRes)
    })
}
