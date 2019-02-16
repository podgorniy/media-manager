import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

@inject('appState')
@observer
export class ToggleSidebar extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div
                onClick={() => {
                    appState.toggleSide()
                }}
            >
                {appState.sideExpanded ? '<<<<<<' : '>>>>>'}
            </div>
        )
    }
}
