import * as React from 'react';
import {observer} from 'mobx-react';
import {inject} from 'mobx-react';
import {IAppState} from './app-state';
import {LogoutBtn} from './LogoutBtn';

@inject('appState')
@observer
export class Navigation extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props
        return(<div>
            {appState.isAuthenticated ? <LogoutBtn /> : <div>Please login</div>}
        </div>)
    }
}
