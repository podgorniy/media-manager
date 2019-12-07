import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import copy from 'copy-to-clipboard'
import {Button} from 'semantic-ui-react'

interface IProps {
    mediaItemUUID: string
}

interface IState {}

@inject('appState')
@observer
export class ShareMediaItem extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, mediaItemUUID} = this.props
        const mediaItem = appState.media.find((item) => {
            return item.uuid === mediaItemUUID
        })
        if (!mediaItem) {
            return null
        }
        const {sharedIndividually, uuid, originalUrl} = mediaItem
        const fullUrl = `${location.protocol}//${location.host}${originalUrl}`
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
