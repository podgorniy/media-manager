import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { SelectAllLoaded } from './SelectAllLoaded'
import { Button } from 'semantic-ui-react'

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
                    <Button size='small' compact onClick={appState.unselectAll}>
                        Deselect all {totalItemsSelected} elements
                    </Button>
                ) : (
                    <SelectAllLoaded />
                )}
            </div>
        )
    }
}
