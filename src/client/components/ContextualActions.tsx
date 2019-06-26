import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ToggleSidebar} from './ToggleSidebar'
import {ToggleSelectionAll} from './ToggleSelectionAll'
import {TagsList} from './TagsList'
import {ToggleSelectionVisible} from './ToggleSelectionVisible'
import {UploadBtn} from './UploadBtn'
import {TagsControls} from './TagsControls'
import {CollectionsControls} from './CollectionsControls'
import {Collectionsss} from './Collectionsss'
import {ShareMediaItem} from './ShareMediaItem'

@inject('appState')
@observer
export class ContextualActions extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        let itemForIndividualSharingControl = appState.zoomedItem
        if (appState.selectedItems.length === 1 && !itemForIndividualSharingControl) {
            itemForIndividualSharingControl = appState.selectedItems[0]
        }
        return (
            <div>
                <ToggleSidebar />
                <UploadBtn />
                {itemForIndividualSharingControl && <ShareMediaItem mediaItem={itemForIndividualSharingControl} />}
                <ToggleSelectionAll />
                <CollectionsControls />
                <TagsControls />
                <ToggleSelectionVisible />
                <TagsList />
                <Collectionsss />
            </div>
        )
    }
}
