import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {LoginForm} from './LoginForm'
import {DragNDropUpload} from './DragNDropUpload'
import {MediaList} from './MediaList'

@inject('appState')
@observer
export class MainView extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props

        if (!appState.isAuthenticated) {
            return <LoginForm />
        }

        return (
            <div>
                <MediaList />
                <DragNDropUpload />
            </div>
        )
    }
}
