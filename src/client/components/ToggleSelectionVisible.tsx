import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

interface IProps {}
interface IState {}

@inject('appState')
@observer
export class ToggleSelectionVisible extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        const {selectedVisibleUUIDs} = appState
        const visibleItemsSelected = selectedVisibleUUIDs.length

        return (
            <div>
                {visibleItemsSelected && visibleItemsSelected !== appState.selectedUUIDs.length ? (
                    <button onClick={appState.unselectVisibleOnly}>
                        Убрать выделение c {visibleItemsSelected} подгруженных элементов
                    </button>
                ) : null}
            </div>
        )
    }
}
