import * as React from 'react';
import {AppState} from './app-state';
import {Provider} from 'mobx-react';
import {initialState} from './initial-state'
import {Navigation} from './Navigation';
import {MainView} from './MainView';

const appState = new AppState(initialState)

export class App extends React.Component<{}, {}> {
    render() {
        return (<Provider appState={appState}>
            <div>
                <Navigation/>
                <MainView />
            </div>
        </Provider>)
    }
}
