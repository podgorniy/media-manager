import {autorun, untracked} from 'mobx'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {getRandomIntInclusive} from '../../common/lib'

require('./MediaListItem.less')

interface IMediaListItemProps {
    uuid: string
    onLoad: () => void
}

interface IMediaListItemState {
    loaded: boolean
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, IMediaListItemState> {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
        this.handleOnLoad = this.handleOnLoad.bind(this)
    }

    private ref = React.createRef<HTMLDivElement>()
    private stopAutoScrollIntoView

    private handleOnLoad() {
        this.props.onLoad()
        this.setState({
            loaded: true
        })
    }

    componentDidMount() {
        const {appState, uuid} = this.props
        let self = this
        this.stopAutoScrollIntoView = autorun(() => {
            const current: HTMLElement = self.ref.current
            if (appState.zoomedItemId === uuid) {
                const {bottom, top} = current.getBoundingClientRect()
                const bottomIsHidden = bottom > window.innerHeight
                const topIsHidden = top < 0
                const isInViewport = !bottomIsHidden && !topIsHidden
                if (!isInViewport) {
                    current.scrollIntoView({
                        behavior: 'smooth',
                        block: topIsHidden ? 'start' : 'end'
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        this.stopAutoScrollIntoView()
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
        const {appState, uuid, onLoad} = this.props
        const {selectedUUIDs} = appState
        const mediaItem = appState.media.find((item) => item.uuid === uuid)
        const {url, focused, type, width, height} = mediaItem
        const aspectPadding = (height / width) * 100
        const selected = selectedUUIDs.indexOf(uuid) !== -1
        const wrapperExtraClass = this.state.loaded
            ? ''
            : `MediaListItem__aspect_inner--loading MediaListItem__aspect_inner--loading-${getRandomIntInclusive(
                  1,
                  5
              ).toString()}`
        return (
            <div
                ref={this.ref}
                onMouseEnter={() => {
                    appState.setHoveredId(uuid)
                }}
                onMouseLeave={() => {
                    appState.setHoveredId(null)
                }}
            >
                <div
                    className={`
                                MediaListItem__outer
                                ${selected ? 'selected' : ''}
                                ${focused ? 'focused' : ''}
                            `}
                >
                    <div className='MediaListItem__aspect' style={{paddingBottom: aspectPadding + '%'}}>
                        <div className={`MediaListItem__aspect_inner ${wrapperExtraClass}`}>
                            {type === 'img' && (
                                <img
                                    onClick={this.clickHandler}
                                    src={url}
                                    className='MediaListItem'
                                    alt={uuid}
                                    onLoad={this.handleOnLoad}
                                />
                            )}

                            {type === 'video' && (
                                <video
                                    controls
                                    onClick={this.clickHandler}
                                    src={url}
                                    className='MediaListItem'
                                    onLoad={this.handleOnLoad}
                                    width='100%'
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
