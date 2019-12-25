import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {LogoutBtn} from './LogoutBtn'

@inject('appState')
@observer
export class Navigation extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props
        return (
            <div className='navigation'>
                <div className='navigation__items'>{appState.isAuthenticated ? <LogoutBtn /> : null}</div>
            </div>
        )
    }
}
