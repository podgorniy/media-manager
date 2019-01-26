import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {LoginForm} from './LoginForm'
import {DragNDropUpload} from './DragNDropUpload'

@inject('appState')
@observer
export class MainView extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                {!appState.isAuthenticated && <LoginForm />}
                {appState.isAuthenticated && <DragNDropUpload />}
            </div>
        )
    }
}
