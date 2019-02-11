import * as React from 'react'
import {      observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'

@inject('appState')
@observer
export class ToolsPanelView extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props
        return <div>{JSON.stringify(appState)}</div>
    }
}