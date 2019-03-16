require('./MediaListItem.less')
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {MediaType} from '../../common/interfaces'

interface IMediaListItemProps {
    url: string
    uuid: string
    type: MediaType
    onLoad: () => void
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    clickHandler = (event) => {
        const {appState, uuid} = this.props
        if (event.shiftKey) {
            appState.toggleSelected(this.props.uuid)
        } else {
            appState.setZoomed(uuid)
        }
    }

    render() {
        const {appState, type, url, uuid, onLoad} = this.props
        const extraClasses = `media-item`
        return (
            <div
                className={appState.focusedId === uuid ? 'focused' : ''}
                onMouseEnter={() => {
                    appState.setHoveredId(uuid)
                }}
                onMouseLeave={() => {
                    appState.setHoveredId(null)
                }}
            >
                {type === 'img' && (
                    <img
                        onClick={this.clickHandler}
                        src={url}
                        className={`MediaListItem ${extraClasses}`}
                        alt={uuid}
                        onLoad={onLoad}
                    />
                )}

                {type === 'video' && (
                    <video
                        controls
                        onClick={this.clickHandler}
                        src={url}
                        className={`MediaListItem ${extraClasses}`}
                        onLoad={onLoad}
                    />
                )}
            </div>
        )
    }
}
