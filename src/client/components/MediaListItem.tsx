import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {mediaTypes} from '../../common/interfaces'

interface IMediaListItemProps {
    url: string
    uuid: string
    type: mediaTypes
    onLoad: () => void
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, type, url, uuid, onLoad} = this.props
        const extraClasses = `media-item`
        const clickHandler = () => {
            appState.toggleSelected(uuid)
        }
        switch (type) {
            case 'img':
                return (
                    <img
                        onClick={clickHandler}
                        src={url}
                        className={`media-image ${extraClasses}`}
                        alt={uuid}
                        onLoad={onLoad}
                    />
                )
            case 'video':
                return (
                    <video
                        controls
                        onClick={clickHandler}
                        src={url}
                        className={`media-video ${extraClasses}`}
                        onLoad={onLoad}
                    />
                )
            default:
                throw new Error(`Unknown media type ${type} in MediaListItem`)
        }
    }
}
