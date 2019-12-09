import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Icon} from 'semantic-ui-react'
import {autorun} from 'mobx'
import {throttle} from '../lib'

require('./ZoomedView.css')

interface IZoomedView {
    scale: number
    currentShiftLeft: number
    currentShiftTop: number
    startMoveX: number
    startMoveY: number
    startMoveShiftLeft: number
    startMoveShiftTop: number
    dragging: boolean
    prevSrc: string
    currentSrc: string
    showLoadingBackground: boolean
}

interface IZoomedViewProps {}

const FITTING_RATIO = 0.85

@inject('appState')
@observer
export class ZoomedView extends React.Component<IZoomedViewProps & IAppState, IZoomedView> {
    private componentRootRef = React.createRef<HTMLDivElement>()
    private innerWrapperRef = React.createRef<HTMLDivElement>()
    private stopWatchingSideWidth
    private stopWatchingUrlChange
    private imageNodeRef = React.createRef<HTMLImageElement>()
    private unmounted = true

    constructor(props) {
        super(props)
        const {zoomedItem} = this.props.appState
        const {originalUrl} = zoomedItem
        this.state = {
            scale: 0,
            currentShiftLeft: 0,
            currentShiftTop: 0,
            startMoveShiftLeft: 0,
            startMoveShiftTop: 0,
            startMoveX: 0,
            startMoveY: 0,
            dragging: false,
            prevSrc: '',
            currentSrc: '',
            showLoadingBackground: false
        }
    }

    keyDown = (event) => {
        const {appState} = this.props
        if (event.code === 'Space') {
            // In zoomed view. Exit zoomed view
            if (appState.zoomedItemId) {
                this.close()
                event.preventDefault()
                return
            }
        }
    }

    keyup = (e) => {
        if (e.code === 'Escape') {
            this.close()
        }
        if (e.code === 'ArrowRight') {
            this.viewNext()
        }
        if (e.code === 'ArrowLeft') {
            this.viewPrev()
        }
    }

    mousedown = (e) => {
        e.preventDefault()
        const {screenX, screenY} = e
        this.setState({
            ...this.state,
            startMoveY: screenY,
            startMoveX: screenX,
            dragging: true,
            startMoveShiftTop: this.state.currentShiftTop,
            startMoveShiftLeft: this.state.currentShiftLeft
        })
        document.documentElement.addEventListener('mousemove', this.mousemove)
        document.documentElement.addEventListener('mouseup', this.mouseup)
    }

    mousemove = (e) => {
        e.preventDefault()
        const {screenX, screenY} = e
        const {startMoveX, startMoveY} = this.state
        this.setState({
            ...this.state,
            currentShiftLeft: this.state.startMoveShiftLeft - (startMoveX - screenX),
            currentShiftTop: this.state.startMoveShiftTop - (startMoveY - screenY)
        })
    }

    mouseup = () => {
        document.documentElement.removeEventListener('mousemove', this.mousemove)
        this.setState({
            ...this.state,
            startMoveY: 0,
            startMoveX: 0,
            dragging: false
        })
    }

    resize = () => {
        this.fitIntoView()
    }

    getFittingRatio = (): number => {
        const {appState} = this.props
        const {zoomedItem} = appState
        const {width, height} = zoomedItem
        const currentWrapperNodeRef = this.componentRootRef.current
        const viewWidth = currentWrapperNodeRef.offsetWidth
        const viewHeight = currentWrapperNodeRef.offsetHeight
        const viewMaxWidth = viewWidth * FITTING_RATIO
        const viewMaxHeight = viewHeight * FITTING_RATIO

        if (width <= viewMaxWidth && height < viewMaxHeight) {
            return 1
        } else {
            const scaleWidth = viewMaxWidth / width
            const scaleHeight = viewMaxHeight / height
            return Math.min(scaleWidth, scaleHeight)
        }
    }

    fitIntoView = () => {
        this.setState({...this.state, scale: this.getFittingRatio()})
    }

    viewNext() {
        const {appState} = this.props
        appState.shiftZoomed(1)
        this.fitIntoView()
    }

    viewPrev() {
        const {appState} = this.props
        appState.shiftZoomed(-1)
        this.fitIntoView()
    }

    componentDidUpdate() {}

    componentDidMount() {
        this.unmounted = false
        document.body.classList.add('disable-scroll')
        document.documentElement.addEventListener('keydown', this.keyDown)
        document.documentElement.addEventListener('keyup', this.keyup)
        this.innerWrapperRef.current.addEventListener('mousedown', this.mousedown)
        window.addEventListener('resize', this.resize)
        this.stopWatchingSideWidth = autorun(() => {
            // sideWidth is required to react to change of this value
            // when component is dismounted there is not zoomedItem, but callback is called.
            // So check for zoomed item existence
            const {sideWidth, zoomedItem} = this.props.appState
            if (zoomedItem) {
                // Wait for components to render after sideWidth change so fitIntoView uses relevant value
                setTimeout(this.fitIntoView, 0)
            }
        })

        let showLoadingIndicatorTimeout
        this.stopWatchingUrlChange = autorun(() => {
            if (this.props.appState.zoomedItem) {
                const {originalUrl} = this.props.appState.zoomedItem
                if (originalUrl !== this.state.currentSrc) {
                    this.setState({
                        prevSrc: this.state.currentSrc,
                        currentSrc: '',
                        showLoadingBackground: false
                    })
                    requestAnimationFrame(() => {
                        clearTimeout(showLoadingIndicatorTimeout)
                        this.setState({
                            currentSrc: originalUrl
                        })
                        // Video might be active at the moment
                        if (this.imageNodeRef && this.imageNodeRef.current) {
                            this.imageNodeRef.current.onload = () => {
                                // Component might be already unmounted
                                if (!this.unmounted) {
                                    this.setState({
                                        showLoadingBackground: false
                                    })
                                }
                            }
                        }
                        showLoadingIndicatorTimeout = setTimeout(() => {
                            this.setState({
                                showLoadingBackground: true
                            })
                        }, 500)
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        document.body.classList.remove('disable-scroll')
        document.documentElement.removeEventListener('keydown', this.keyDown)
        document.documentElement.removeEventListener('keyup', this.keyup)
        this.innerWrapperRef.current.removeEventListener('mousedown', this.mousedown)
        document.documentElement.removeEventListener('mouseup', this.mouseup)
        document.documentElement.removeEventListener('mousemove', this.mousemove)
        window.removeEventListener('resize', this.resize)
        this.stopWatchingSideWidth()
        this.stopWatchingUrlChange()
        this.unmounted = true
    }

    close() {
        this.props.appState.setZoomed(null)
    }

    render() {
        const {appState} = this.props
        const {zoomedItem, sideWidth} = appState
        const {type, originalUrl, previewUrl} = zoomedItem
        const srcUrl = this.state.currentSrc
        const {currentShiftLeft, currentShiftTop} = this.state
        const transformString = `translate(${currentShiftLeft}px, ${currentShiftTop}px) scale(${this.state.scale})`
        return (
            <div
                className={`ZoomedView ${this.state.dragging ? 'ZoomedView--move-cursor' : ''}`}
                style={{
                    left: sideWidth + 'px'
                }}
                ref={this.componentRootRef}
                onClick={(event) => {
                    if ((event.target as HTMLElement).classList.contains('js-overlay')) {
                        this.close()
                    }
                }}
                onWheel={throttle((event) => {
                    const currentScale = this.state.scale
                    const stepValue = (currentScale / 100) * 6
                    const step = event.deltaY > 0 ? -stepValue : stepValue
                    let nextScale = currentScale + step
                    if (nextScale <= 0) {
                        nextScale = 0.01
                    } else if (nextScale > 5) {
                        nextScale = 5
                    }
                    this.setState({...this.state, scale: nextScale})
                }, 16)}
            >
                <div className='ZoomedView__media-wrapper-outer js-overlay'>
                    <div
                        className='ZoomedView__media-wrapper-inner'
                        style={{
                            transform: transformString
                        }}
                        ref={this.innerWrapperRef}
                    >
                        {zoomedItem
                            ? type === 'img' && (
                                  <img
                                      alt=''
                                      className={`ZoomedView__container ZoomedView__img ${this.state.showLoadingBackground ? 'ZoomedView__img-loading' : ''}`}
                                      style={{
                                          width: zoomedItem.width,
                                          height: zoomedItem.height
                                      }}
                                      ref={this.imageNodeRef}
                                      src={srcUrl}
                                  />
                              )
                            : null}
                        {zoomedItem
                            ? type === 'video' && (
                                  <video
                                      autoPlay={true}
                                      controls
                                      className='ZoomedView__container ZoomedView__video'
                                      src={srcUrl}
                                  />
                              )
                            : null}
                    </div>
                </div>

                <div
                    className='ZoomedView__control-prev'
                    onClick={() => {
                        this.viewPrev()
                    }}
                >
                    <Icon name='angle left' link color='grey' inverted size='huge' />
                </div>
                <div
                    className='ZoomedView__control-next'
                    onClick={() => {
                        this.viewNext()
                    }}
                >
                    <Icon name='angle right' link color='grey' inverted size='huge' />
                </div>
                <div
                    className='ZoomedView__control-exit'
                    onClick={() => {
                        this.close()
                    }}
                >
                    <Icon name='close' link color='grey' inverted size='huge' />
                </div>
            </div>
        )
    }
}
