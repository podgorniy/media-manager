import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

@inject('appState')
@observer
export class ToggleSelection extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        const {selected} = appState
        const totalItemsSelected = selected.length
        return (
            <div>
                {totalItemsSelected ? (
                    <button onClick={appState.unselectAll}>Убрать выделение {totalItemsSelected} элементов</button>
                ) : (
                    'Ничего не выбрано'
                )}
            </div>
        )
    }
}
