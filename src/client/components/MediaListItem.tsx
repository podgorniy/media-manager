import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {mediaTypes} from '../../common/interfaces'

interface IMediaListItemProps {
    url: string
    uuid: string
    type: mediaTypes
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, type, url, uuid} = this.props
        const extraClasses = `media-item`
        const clickHandler = () => {
            appState.toggleSelected(uuid)
        }
        switch (type) {
            case 'img':
                return <img onClick={clickHandler} src={url} className={`media-image ${extraClasses}`} alt={uuid} />
            case 'video':
                return <video onClick={clickHandler} src={url} className={`media-video ${extraClasses}`} controls />
            default:
                throw new Error(`Unknown media type ${type} in MediaListItem`)
        }
    }
}
