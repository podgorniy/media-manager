import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

require('./ZoomedView.css')

@inject('appState')
@observer
export class ZoomedView extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    keyDown = (event) => {
        const {appState} = this.props
        if (event.code === 'Space') {
            // In zoomed view. Exit zoomed view
            if (appState.zoomedItemId) {
                appState.setZoomed(null)
                event.preventDefault()
                return
            }
            // Some element is focused
            if (appState.focusedId) {
                appState.setZoomed(appState.focusedId)
                event.preventDefault()
                return
            }
        }
    }

    keyup = (e) => {
        if (e.code === 'Escape') {
            this.close()
        }
        if (e.code === 'ArrowRight') {
            this.viewNext()
        }
        if (e.code === 'ArrowLeft') {
            this.viewPrev()
        }
    }

    viewNext() {
        const {appState} = this.props
        if (appState.zoomedItemId) {
            appState.shiftZoomed(1)
        }
    }
    viewPrev() {
        const {appState} = this.props
        if (appState.zoomedItemId) {
            appState.shiftZoomed(-1)
        }
    }

    componentDidMount(): void {
        document.documentElement.addEventListener('keydown', this.keyDown)
        document.documentElement.addEventListener('keyup', this.keyup)
    }

    componentWillUnmount(): void {
        document.documentElement.removeEventListener('keydown', this.keyDown)
        document.documentElement.removeEventListener('keyup', this.keyup)
    }

    close() {
        this.props.appState.setZoomed(null)
    }

    render() {
        const {appState} = this.props
        const {zoomedItem} = appState
        let type
        let url
        if (zoomedItem) {
            type = zoomedItem.type
            url = zoomedItem.url
        }
        return (
            appState.zoomedItemId && (
                <div
                    className='ZoomedView'
                    style={{
                        left: appState.sideWidth + 'px'
                    }}
                >
                    <h1>This is zoomed view</h1>
                    <h1>{appState.zoomedItemId}</h1>
                    <div
                        onClick={() => {
                            this.viewNext()
                        }}
                    >
                        next
                    </div>
                    <div
                        onClick={() => {
                            this.viewPrev()
                        }}
                    >
                        prev
                    </div>
                    {zoomedItem
                        ? type === 'img' && <img className='ZoomedView__container ZoomedView__img' src={url} />
                        : null}
                    {zoomedItem
                        ? type === 'video' && (
                              <video controls className='ZoomedView__container ZoomedView__video' src={url} />
                          )
                        : null}
                    <div />
                </div>
            )
        )
    }
}
