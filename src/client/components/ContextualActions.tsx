import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ToggleSidebar} from './ToggleSidebar'
import {ToggleSelectionAll} from './ToggleSelectionAll'
import {TagsList} from './TagsList'
import {ToggleSelectionVisible} from './ToggleSelectionVisible'
import {UploadBtn} from './UploadBtn'

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
                <UploadBtn />
                <ToggleSelectionAll />
                <ToggleSelectionVisible />
                <TagsList />
            </div>
        )
    }
}
