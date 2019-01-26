import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from './app-state'
import {logout} from './api'

@inject('appState')
@observer
export class LogoutBtn extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <span
                onClick={async () => {
                    const logoutSuccess = await logout()
                    if (logoutSuccess) {
                        appState.setAuthenticated(false)
                    } else {
                        alert('Failed to logout')
                    }
                }}
            >
                Logout {appState.userName}
            </span>
        )
    }
}
