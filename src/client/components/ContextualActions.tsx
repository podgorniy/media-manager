import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ToggleSidebar} from './ToggleSidebar'
import {ToggleSelection} from './ToggleSelection'
import {TagsList} from './TagsList'

@inject('appState')
@observer
export class ContextualActions extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <ToggleSidebar />
                <ToggleSelection />
                <TagsList />
            </div>
        )
    }
}
