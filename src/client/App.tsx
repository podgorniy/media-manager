import * as React from 'react';
import {AppState} from './app-state';
import {Provider} from 'mobx-react';
import {Counter} from './Counter';

const appState = new AppState()

export class App extends React.Component<{}, {}> {
    render() {
        return (<Provider appState={appState}>
            <Counter/>
        </Provider>)
    }
}
