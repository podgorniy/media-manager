import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'
import {UUID} from '../../common/interfaces'
import {Button, Icon} from 'semantic-ui-react'

interface IProps {
    UUIDs: Array<UUID>
}

interface IState {}

@inject('appState')
@observer
export class SelectionControls extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, UUIDs} = this.props
        const areAllInSelection = UUIDs.every((uuid) => {
            return appState.selectedUUIDs.indexOf(uuid) !== -1
        })
        return (
            <Button
                compact
                size='small'
                onClick={() => {
                    if (areAllInSelection) {
                        appState.removeFromSelection(UUIDs)
                    } else {
                        appState.addToSelection(UUIDs)
                    }
                }}
            >
                {areAllInSelection ? 'Remove from selected' : 'Add to selected'}
            </Button>
        )
    }
}
