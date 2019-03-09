import * as React from 'react'
import {AppState} from '../app-state'
import {Provider} from 'mobx-react'
import {isDev} from '../../common/lib'
import {Layout} from './Layout'

require('./App.css')

const appState = new AppState(window['initialState'])
if (isDev()) {
    window['a'] = appState
}

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <Provider appState={appState}>
                <Layout />
            </Provider>
        )
    }
}
