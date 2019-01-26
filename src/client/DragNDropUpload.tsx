require('./DragNDropUpload.less')
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from './app-state'

interface IDragNDropUploadState {
    visible: boolean
}

@inject('appState')
@observer
export class DragNDropUpload extends React.Component<{} & IAppState, IDragNDropUploadState> {
    private readonly ref = React.createRef<HTMLDivElement>()
    private dragEnterCount = 0

    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
        this._dragEnter = this._dragEnter.bind(this)
        this._dragLeave = this._dragLeave.bind(this)
        this._dragEnd = this._dragEnd.bind(this)
    }

    private _dragEnter(event) {
        this.dragEnterCount += 1
        this.setState({
            visible: true
        })
        // console.log('_dragEnter', event.target, this.e, this.l)
    }

    private _dragLeave(event) {
        this.dragEnterCount -= 1
        if (!this.dragEnterCount) {
            this.setState({
                visible: false
            })
        }
    }

    private _dragEnd(event) {
        console.log('_dragEnd', event)
    }

    componentDidMount(): void {
        console.log('add dnd events')
        document.addEventListener('dragenter', this._dragEnter, false)
        document.addEventListener('dragleave', this._dragLeave, false)
        document.addEventListener('dragend', this._dragEnd, false) // TODO: review if needed
    }

    componentWillUnmount(): void {
        console.log('remove dnd events')
        document.removeEventListener('dragenter', this._dragEnter, false)
        document.removeEventListener('dragleave', this._dragLeave, false)
        document.removeEventListener('dragend', this._dragEnd, false) // TODO: review if needed
    }

    render() {
        return (
            <div
                style={{
                    display: this.state.visible ? 'block' : 'none'
                }}
                ref={this.ref}
                className='DragNDropUpload'
            >
                <h1>Heya</h1>
            </div>
        )
    }
}
