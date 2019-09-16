import * as React from 'react'
import {FunctionComponent} from 'react'
import {AppState} from '../app-state'
import {Provider} from 'mobx-react'
import {Layout} from './Layout'

require('./App.css')
import 'semantic-ui-css/semantic.min.css'

export function initApp(appState: AppState): FunctionComponent<{}> {
    return function() {
        return (
            <Provider appState={appState}>
                <Layout />
            </Provider>
        )
    }
}
