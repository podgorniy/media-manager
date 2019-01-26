import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

@inject('appState')
@observer
export class Counter extends React.Component<{} & IAppState, {}> {
    render() {
        const {appState} = this.props
        return (
            <div>
                <button
                    onClick={() => {
                        appState.changeCount(1)
                    }}
                >
                    +
                </button>
                <button
                    onClick={() => {
                        appState.changeCount(-1)
                    }}
                >
                    -
                </button>
                {appState.count}
            </div>
        )
    }
}
