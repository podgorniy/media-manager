import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
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
                {visibleItemsSelected ? (
                    <button onClick={appState.unselectVisibleOnly}>
                        Убрать выделение {visibleItemsSelected} подгруженных элементов
                    </button>
                ) : (
                    'Ничего не выбрано'
                )}
            </div>
        )
    }
}
