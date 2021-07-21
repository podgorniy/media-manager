import {Icon, Progress} from 'semantic-ui-react'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {throttle} from '../lib'

require('dropzone/dist/min/basic.min.css')
require('dropzone/dist/min/dropzone.min.css')
require('./Upload.css')
import Dropzone = require('dropzone')

interface IUploadState {
    itemsToProcess: number
    itemsSucceeded: number
    itemsFailed: number
}

@inject('appState')
@observer
export class Upload extends React.Component<{} & IAppState, IUploadState> {
    constructor(props) {
        super(props)
        this.state = {
            itemsToProcess: 0,
            itemsSucceeded: 0,
            itemsFailed: 0
        }
        this.keydownHandler = (event) => {
            const {appState} = this.props
            if (!appState.uploadIsVisible) {
                return
            }
            if (event.code === 'Escape') {
                appState.toggleUploadVisibility(false)
            }
        }
        document.addEventListener('paste', (event) => {
            const {appState} = this.props
            if (!appState.uploadIsVisible) {
                return
            }
            const {items} = event.clipboardData
            for (let i in items) {
                if (items[i].kind === 'file') {
                    // when you paste folder or inappropriate files
                    try {
                        this.dropZone.addFile(items[i].getAsFile())
                    } catch (e) {
                        // console.error(e)
                    }
                }
            }
        })
    }

    private readonly keydownHandler
    private readonly ref = React.createRef<HTMLDivElement>()
    private dropZone

    componentDidMount(): void {
        Dropzone.autoDiscover = false // otherwise runtime errors
        this.dropZone = new Dropzone(this.ref.current, {
            url: '/api/v1/upload',
            paramName: 'uploads',
            acceptedFiles: 'image/*,.mp4',
            parallelUploads: 4
        })
        this.dropZone.on('addedfile', () => {
            this.setState({
                itemsToProcess: this.state.itemsToProcess + 1
            })
        })
        const throttlesMediaRefresh = throttle(() => {
            this.props.appState.refreshMedia()
        }, 999)
        this.dropZone.on('complete', ({status}) => {
            throttlesMediaRefresh()
            if (status === 'success') {
                this.setState({
                    itemsSucceeded: this.state.itemsSucceeded + 1
                })
            } else {
                this.setState({
                    itemsFailed: this.state.itemsFailed + 1
                })
            }
        })
        document.addEventListener('keydown', this.keydownHandler)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydownHandler)
    }

    render() {
        const {appState} = this.props
        const {itemsToProcess, itemsFailed, itemsSucceeded} = this.state
        const showProgress = !!itemsToProcess
        const uploadingIsInProgress = this.state.itemsToProcess !== itemsFailed + itemsSucceeded
        const progressPercent = showProgress ? ((itemsFailed + itemsSucceeded) / itemsToProcess) * 100 : 0
        const progressLabelMessage =
            (itemsFailed ? 'Failed: ' + itemsFailed : '') +
            (itemsSucceeded ? (itemsFailed ? ' / ' : '') + ('Succeeded: ' + itemsSucceeded) : '')
        return (
            <div
                className='dropzone Upload'
                style={{
                    display: appState.uploadIsVisible ? 'block' : 'none'
                }}
            >
                <div className='Upload__dropzone' ref={this.ref}>
                    <div className='Upload__head'>
                        <div>
                            <h1>Drag-n-drop files and folders</h1>
                        </div>
                        <div>
                            <h1>Or click grey area to browse local folders</h1>
                        </div>
                        <div>
                            <h1>Or paste image from clipboard</h1>
                        </div>
                        <Icon
                            onClick={() => {
                                appState.toggleUploadVisibility(false)
                            }}
                            size='huge'
                            className='Upload__close'
                            name='close'
                            color='grey'
                            inverted
                        />
                        {showProgress ? (
                            <Progress
                                inverted
                                className='Upload__progress'
                                indicating={uploadingIsInProgress}
                                percent={progressPercent}
                                color='green'
                            >
                                {progressLabelMessage}
                            </Progress>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    }
}
