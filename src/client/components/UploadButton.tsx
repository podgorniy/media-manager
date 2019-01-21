require('./UploadButton.less')
import * as React from 'react'

export class UploadButton extends React.Component<{}, {}> {
    private _fileInputRef = React.createRef<HTMLInputElement>()
    private _handlerSubmit = async event => {
        event.preventDefault()
        const filesField: HTMLInputElement = this._fileInputRef.current
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
    }
    private _handleChange = event => {
        event.preventDefault()
        console.log(`Selected files: ${event.target.files}`)
    }

    render() {
        return (
            <form onSubmit={this._handlerSubmit}>
                <input ref={this._fileInputRef} type='file' multiple />
                <button type='submit'>Submit</button>
            </form>
        )
    }
}
