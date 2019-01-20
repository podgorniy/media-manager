require('./UploadButton.less')
import * as React from 'react'

export class UploadButton extends React.Component<{}, {}> {
    private _handleChange = event => {
        event.preventDefault()
        console.log(`Selected files: ${event.target.files}`)
    }

    render() {
        return (
            <label className='UploadButtonLabel'>
                Upload file
                <input className='UploadButtonInput' type='file' onChange={this._handleChange} />
            </label>
        )
    }
}
