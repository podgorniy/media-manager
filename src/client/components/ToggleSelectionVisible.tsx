import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button} from 'semantic-ui-react'

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
        const itemsSelected = selectedVisibleUUIDs.length

        return (
            <div>
                {itemsSelected && itemsSelected !== appState.selectedUUIDs.length ? (
                    <Button size='small' compact onClick={appState.unselectSelected}>
                        Deselect <strong>{itemsSelected}</strong> items
                    </Button>
                ) : null}
            </div>
        )
    }
}
