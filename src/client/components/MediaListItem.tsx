import {autorun} from 'mobx'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {getRandomIntInclusive, throttleTo60Fps} from '../../common/lib'

require('./MediaListItem.less')

interface IMediaListItemProps {
    uuid: string
    onLoad: () => void
}

interface IMediaListItemState {
    loaded: boolean
    shouldShow: boolean
}

// TODO: review implementation
function isGif(src: string): boolean {
    return src.split('.')[1] === 'gif'
}

@inject('appState')
@observer
export class MediaListItem extends React.Component<IMediaListItemProps & IAppState, IMediaListItemState> {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            shouldShow: true
        }
        this.handleOnLoad = this.handleOnLoad.bind(this)
        this.showOnlyInViewport = throttleTo60Fps(() => {
            const [bottomIsHidden, topIsHidden, isInViewport, isPartiallyInViewport] = this.viewPortState(
                this.ref.current
            )
            if (isPartiallyInViewport) {
                if (!this.state.shouldShow) {
                    this.setState({
                        shouldShow: true
                    })
                }
            } else {
                if (this.state.shouldShow) {
                    this.setState({
                        shouldShow: false
                    })
                }
            }
        })
    }

    private ref = React.createRef<HTMLDivElement>()

    private stopAutoScrollIntoView

    private showOnlyInViewport

    private isVisible = true

    private handleOnLoad() {
        this.props.onLoad()
        this.setState({
            loaded: true
        })
    }

    viewPortState(node) {
        const {bottom, top} = node.getBoundingClientRect()
        const bottomIsHidden = bottom > window.innerHeight
        const topIsHidden = top < 0
        const isFullyInViewport = !bottomIsHidden && !topIsHidden
        const isPartiallyInViewport =
            (bottom >= 0 && bottom < window.innerHeight) ||
            (top >= 0 && top < window.innerHeight) ||
            (top <= 0 && bottom - window.innerHeight > 0)
        return [bottomIsHidden, topIsHidden, isFullyInViewport, isPartiallyInViewport]
    }

    componentDidMount() {
        const {appState, uuid} = this.props
        let self = this
        this.stopAutoScrollIntoView = autorun(() => {
            const current: HTMLElement = self.ref.current
            if (appState.zoomedItemId === uuid) {
                const [_, topIsHidden, isInViewport] = this.viewPortState(self.ref.current)
                if (!isInViewport) {
                    current.scrollIntoView({
                        behavior: 'smooth',
                        block: topIsHidden ? 'start' : 'end'
                    })
                }
            }
        })
        window.addEventListener('scroll', this.showOnlyInViewport)
        window.addEventListener('resize', this.showOnlyInViewport)
        this.showOnlyInViewport()
    }

    componentWillUnmount() {
        this.stopAutoScrollIntoView()
        window.removeEventListener('scroll', this.showOnlyInViewport)
        window.removeEventListener('resize', this.showOnlyInViewport)
    }

    clickHandler = (event) => {
        const {appState, uuid} = this.props
        if (event.shiftKey) {
            appState.toggleSelected(this.props.uuid)
        } else {
            appState.setZoomed(uuid)
        }
    }

    componentDidUpdate() {
        this.showOnlyInViewport()
    }

    render() {
        const {appState, uuid, onLoad} = this.props
        const {selectedUUIDs} = appState
        const mediaItem = appState.media.find((item) => item.uuid === uuid)
        const {originalUrl, previewUrl, focused, type, width, height} = mediaItem
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
                style={{
                    visibility: this.state.shouldShow ? 'visible' : 'hidden'
                }}
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
                                ${isGif(originalUrl) ? 'MediaListItem__outer-gif' : ''}
                                ${selected ? 'selected' : ''}
                                ${focused ? 'focused' : ''}
                            `}
                >
                    <div className='MediaListItem__aspect' style={{paddingBottom: aspectPadding + '%'}}>
                        <div onClick={this.clickHandler} className={`MediaListItem__aspect_inner ${wrapperExtraClass}`}>
                            {type === 'img' && (
                                <img
                                    src={previewUrl}
                                    className={`MediaListItem`}
                                    alt={uuid}
                                    onLoad={this.handleOnLoad}
                                />
                            )}

                            {type === 'video' && (
                                <video
                                    controls
                                    src={previewUrl}
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
