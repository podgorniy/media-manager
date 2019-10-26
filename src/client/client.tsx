import 'semantic-ui-css/semantic.min.css'
import * as React from 'react'
import { initApp } from './components/App'
import { render } from 'react-dom'
import { AppState } from './app-state'
import { isDev } from '../common/lib'
import { initServices } from './services'

const appState = new AppState(window['initialState'])
if (isDev()) {
    window['a'] = appState
}
initServices(appState)
const App = initApp(appState)
render(<App />, document.getElementById('app'))
