import * as React from 'react'
import {AppState} from '../app-state'
import {Provider} from 'mobx-react'
import {Navigation} from './Navigation'
import {MainView} from './MainView'

const appState = new AppState(window['initialState'])

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <Provider appState={appState}>
                <>
                    <Navigation />
                    <MainView />
                </>
            </Provider>
        )
    }
}
