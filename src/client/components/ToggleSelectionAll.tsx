import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {SelectAllLoaded} from './SelectAllLoaded'

@inject('appState')
@observer
export class ToggleSelectionAll extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        const {selectedUUIDs} = appState
        const totalItemsSelected = selectedUUIDs.length
        return (
            <div>
                {totalItemsSelected ? (
                    <button onClick={appState.unselectAll}>Убрать выделение {totalItemsSelected} элементов</button>
                ) : (
                    <SelectAllLoaded />
                )}
            </div>
        )
    }
}
