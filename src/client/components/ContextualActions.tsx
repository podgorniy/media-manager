import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ToggleSelectionAll} from './ToggleSelectionAll'
import {TagsList} from './TagsList'
import {ToggleSelectionVisible} from './ToggleSelectionVisible'
import {CollectionsControls} from './CollectionsControls'
import {ShareMediaItem} from './ShareMediaItem'
import './ContextualActions.css'
import {Button, Icon} from 'semantic-ui-react'
import {logout} from '../api'
import {Collections2} from './Collections2'
import {TagsControls} from './TagsControls'
import {SelectionControls} from './SelectionControls'
import {DeleteMedia} from './DeleteMedia'
import {DownloadMedia} from './DownloadMedia'

@inject('appState')
@observer
export class ContextualActions extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div className='ContextualActions'>
                <div className='ContextualActions__block ContextualActions__user'>
                    <div className='ContextualActions__row'>
                        <Button.Group size='tiny' icon>
                            <Button
                                compact
                                size='tiny'
                                active={appState.sideExpanded}
                                onClick={() => {
                                    appState.toggleSide()
                                }}
                            >
                                <Icon className='ToggleMenu' name='bars' />
                            </Button>
                            <Button
                                compact
                                size='tiny'
                                onClick={() => {
                                    appState.toggleUploadVisibility(true)
                                }}
                            >
                                Upload
                            </Button>
                            <Button
                                compact
                                size='tiny'
                                onClick={async () => {
                                    const logoutSuccess = await logout()
                                    if (logoutSuccess) {
                                        appState.setAuthenticated(false)
                                    } else {
                                        alert('Failed to logout')
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        </Button.Group>
                    </div>
                </div>
                {appState.zoomedItemId && (
                    <div className='ContextualActions__block ContextualActions__zoomed'>
                        <div className='ContextualActions__row'>
                            <ShareMediaItem mediaItemUUID={appState.zoomedItemId} />
                            <div className='clear' />
                        </div>
                        <div className='ContextualActions__row'>
                            <SelectionControls UUIDs={[appState.zoomedItemId]} />
                        </div>
                        <div className='ContextualActions__row'>
                            <Button.Group size='small' compact>
                                <DeleteMedia UUIDs={[appState.zoomedItemId]} />
                                <DownloadMedia UUIDs={[appState.zoomedItemId]} count={1} />
                            </Button.Group>
                        </div>
                        <div className='ContextualActions__row'>
                            <TagsControls mediaUUIDs={[appState.zoomedItemId]} />
                        </div>
                        <div className='ContextualActions__row'>
                            <CollectionsControls UUIDs={[appState.zoomedItemId]} />
                        </div>
                    </div>
                )}
                <div className='ContextualActions__block ContextualActions__selected'>
                    {appState.selectedUUIDs.length ? (
                        <React.Fragment>
                            <div className='ContextualActions__row'>
                                <ToggleSelectionAll />
                            </div>
                            <div className='ContextualActions__row'>
                                <Button.Group size='small' compact>
                                    <DeleteMedia UUIDs={appState.selectedUUIDs} />
                                    <DownloadMedia UUIDs={appState.selectedUUIDs} count={appState.selectedUUIDs.length} />
                                </Button.Group>
                            </div>
                            {appState.selectedUUIDs.length === 1 ? (
                                <div className='ContextualActions__row'>
                                    <ShareMediaItem mediaItemUUID={appState.selectedUUIDs[0]} />
                                    <div className='clear' />
                                </div>
                            ) : null}
                            <div className='ContextualActions__row'>
                                <CollectionsControls UUIDs={appState.selectedUUIDs} />
                            </div>
                            <div className='ContextualActions__row'>
                                <TagsControls mediaUUIDs={appState.selectedUUIDs} />
                            </div>
                            <div className='ContextualActions__row'>
                                <ToggleSelectionVisible />
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className='ContextualActions__row'>
                                <ToggleSelectionAll />
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div className='ContextualActions__block ContextualActions__collections'>
                    <div className='ContextualActions__row'>
                        <TagsList />
                    </div>
                    <div className='ContextualActions__row'>
                        <Collections2 />
                    </div>
                </div>
            </div>
        )
    }
}
