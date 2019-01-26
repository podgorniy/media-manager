require('dropzone/dist/min/basic.min.css')
require('dropzone/dist/min/dropzone.min.css')
require('./DragNDropUpload.less')
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
    private dragEnterCount = 0
    private dropZone

    state = {
        filesHovering: false,
        persistForm: false
    }

    private _dragEnter = () => {
        this.dragEnterCount += 1
        this.setState({
            filesHovering: true
        })
    }

    private _dragLeave = () => {
        this.dragEnterCount -= 1
        if (!this.dragEnterCount) {
            this.setState({
                filesHovering: false
            })
        }
    }

    private _hideForm = () => {
        this.dragEnterCount = 0
        this.setState({
            filesHovering: false,
            persistForm: false
        })
    }

    componentDidMount(): void {
        document.addEventListener('dragenter', this._dragEnter, true)
        document.addEventListener('dragleave', this._dragLeave, true)
        Dropzone.autoDiscover = false // otherwise runtime errors
        this.dropZone = new Dropzone(this.ref.current, {
            url: '/api/v1/upload',
            paramName: 'uploads',
            acceptedFiles: 'image/*,.mp4'
        })
    }

    componentWillUnmount(): void {
        document.removeEventListener('dragenter', this._dragEnter, true)
        document.removeEventListener('dragleave', this._dragLeave, true)
        this.dropZone.disable()
        this.dropZone = null
    }

    render() {
        const shouldBeShown = this.state.persistForm || this.state.filesHovering
        return (
            <div
                className='dropzone DragNDropUpload'
                style={{
                    display: shouldBeShown ? 'block' : 'none'
                }}
            >
                <div className='DragNDropUpload__dropzone' ref={this.ref}>
                    <div className='DragNDropUpload__head'>
                        <h1>Загрузка файлов</h1>
                        <div className='DragNDropUpload__btn-wrapper'>
                            <button onClick={this._hideForm}>Закрыть это</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
