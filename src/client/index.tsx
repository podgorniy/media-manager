import * as React from 'react'
import {App} from './components/App'
import {render} from 'react-dom'

require('./client.less')

render(<App />, document.getElementById('app'))
