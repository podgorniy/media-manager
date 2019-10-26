import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { IClientMediaItem } from '../../common/interfaces'
import copy from 'copy-to-clipboard'
import { Button } from 'semantic-ui-react'

interface IProps {
    mediaItem: IClientMediaItem
}

interface IState {}

@inject('appState')
@observer
export class ShareMediaItem extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, mediaItem} = this.props
        const {sharedIndividually, uuid} = mediaItem
        const fullUrl = `${location.protocol}//${location.host}${mediaItem.url}`
        return sharedIndividually ? (
            <Button.Group compact size='small' floated='left'>
                <Button
                    compact
                    size='small'
                    onClick={() => {
                        copy(fullUrl)
                    }}
                >
                    Copy Url
                </Button>
                <Button
                    compact
                    size='small'
                    onClick={() => {
                        appState.unShareMedia(uuid)
                    }}
                >
                    Unshare
                </Button>
            </Button.Group>
        ) : (
            <Button.Group compact size='small' floated='left'>
                <Button
                    size='small'
                    compact
                    onClick={() => {
                        appState.shareMedia(uuid)
                        copy(fullUrl)
                    }}
                >
                    Share and Copy URL
                </Button>
            </Button.Group>
        )
    }
}
