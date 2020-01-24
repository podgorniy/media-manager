import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ZoomedView} from './ZoomedView'
import {isControlFocused} from '../lib'

interface IZoom {
    scale: number
    shiftLeft: number
    shiftTop: number
}

@inject('appState')
@observer
export class Zoom extends React.Component<{} & IAppState, IZoom> {
    render() {
        const {appState} = this.props
        const {zoomedItem} = appState
        if (zoomedItem) {
            return <ZoomedView />
        } else {
            return null
        }
    }

    keyDown = (event) => {
        const {appState} = this.props
        if (event.code === 'Space') {
            // Some element is focused
            if (appState.focusedId && !isControlFocused()) {
                appState.setZoomed(appState.focusedId)
                event.preventDefault()
                return
            }
        }
    }

    componentDidMount(): void {
        document.documentElement.addEventListener('keydown', this.keyDown)
    }

    componentWillUnmount(): void {
        document.documentElement.removeEventListener('keydown', this.keyDown)
    }
}
