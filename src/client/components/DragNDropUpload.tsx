require('dropzone/dist/min/basic.min.css')
require('dropzone/dist/min/dropzone.min.css')
require('./DragNDropUpload.css')
import Dropzone = require('dropzone')
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

interface IDragNDropUploadState {
    filesHovering: boolean
    persistForm: boolean
}

@inject('appState')
@observer
export class DragNDropUpload extends React.Component<{} & IAppState, IDragNDropUploadState> {
    private readonly ref = React.createRef<HTMLDivElement>()
    private dropZone

    componentDidMount(): void {
        Dropzone.autoDiscover = false // otherwise runtime errors
        this.dropZone = new Dropzone(this.ref.current, {
            url: '/api/v1/upload',
            paramName: 'uploads',
            acceptedFiles: 'image/*,.mp4'
        })
    }

    render() {
        const {appState} = this.props
        return (
            <div
                className='dropzone DragNDropUpload'
                style={{
                    display: appState.uploadIsVisible ? 'block' : 'none'
                }}
            >
                <div className='DragNDropUpload__dropzone' ref={this.ref}>
                    <div className='DragNDropUpload__head'>
                        <h1>Uload files</h1>
                        <div className='DragNDropUpload__btn-wrapper'>
                            <button
                                onClick={() => {
                                    appState.toggleUploadVisibility(false)
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
