import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {LogoutBtn} from './LogoutBtn'
import {UploadForm} from './UploadForm'

@inject('appState')
@observer
export class Navigation extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props
        return (
            <div>
                {appState.isAuthenticated ? (
                    <React.Fragment>
                        <LogoutBtn />
                        <UploadForm />
                    </React.Fragment>
                ) : (
                    <div>Please login</div>
                )}
            </div>
        )
    }
}
