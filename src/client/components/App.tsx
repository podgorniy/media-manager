import * as React from 'react'
import {FunctionComponent} from 'react'
import {AppState} from '../app-state'
import {Provider} from 'mobx-react'
import {Layout} from './Layout'
import 'semantic-ui-css/semantic.min.css'

require('./App.css')

export function initApp(appState: AppState): FunctionComponent<{}> {
    return function() {
        return (
            <Provider appState={appState}>
                <Layout />
            </Provider>
        )
    }
}
