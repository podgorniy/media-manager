import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {mediaTypes} from '../../common/lib'

interface IMediaListItemProps {
    url: string
    fileName: string
    selected: boolean
    type: mediaTypes
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, selected, type, url, fileName} = this.props
        const extraClasses = `media-item ${selected ? 'selected' : ''}`
        switch (type) {
            case 'img':
                return <img src={url} className={`media-image ${extraClasses}`} alt={fileName} />
            case 'video':
                return <video src={url} className={`media-video ${extraClasses}`} controls />
            default:
                throw new Error(`Unknown media type ${type} in MediaListItem`)
        }
    }
}
