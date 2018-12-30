require('./client.less')
import {isDev} from '../common/lib'

async function main() {
    const resp = await fetch('/api/v1/check')
    const respJSON = await resp.json()
    console.log(`/api/v1/check`, respJSON)
}

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

const imgupload = document.querySelector('.imgupload')
if (imgupload) {
    imgupload.addEventListener('submit', async (event) => {
        event.preventDefault()
        const filesField: HTMLInputElement = imgupload.querySelector('input[type="file"]')
        const formData = new FormData()
        for (let i = 0; i < filesField.files.length; i += 1) {
            const file = filesField.files[i]
            const fileName = file.name
            formData.append('uploads', file, fileName)
        }
        const uploadResult = await fetch('/api/v1/upload', {
            method: 'POST',
            body: formData
        })
        const uploadResultJSON = await uploadResult.json()
        console.log(`uploadResultJSON`, uploadResultJSON)
    })
}
