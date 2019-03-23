import {autorun} from 'mobx'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {MediaType} from '../../common/interfaces'

require('./MediaListItem.less')

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

    private ref = React.createRef<HTMLDivElement>()
    private stopAutoscrollIntoView

    componentDidMount() {
        const {appState, uuid} = this.props
        let self = this
        this.stopAutoscrollIntoView = autorun(
            function() {
                const current: HTMLElement = self.ref.current.parentNode.parentNode as HTMLElement
                if (appState.zoomedItemId === uuid) {
                    const {top, height} = current.getBoundingClientRect()
                    const isInViewport = top + height > 0 && top < appState.pageScrolled + window.innerHeight
                    if (!isInViewport) {
                        current.scrollIntoView(true)
                    }
                }
            }.bind(this)
        )
    }

    componentWillUnmount() {
        this.stopAutoscrollIntoView()
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
        const itemIsFocused = appState.focusedId === uuid

        return (
            <div
                ref={this.ref}
                className={`${uuid} ${itemIsFocused ? 'focused' : ''} media-item-wrapper-ppp`}
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
