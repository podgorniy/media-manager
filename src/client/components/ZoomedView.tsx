import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Icon} from 'semantic-ui-react'
import {autorun} from 'mobx'

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
}

interface IZoomedViewProps {}

const FITTING_RATIO = 0.85

@inject('appState')
@observer
export class ZoomedView extends React.Component<IZoomedViewProps & IAppState, IZoomedView> {
    componentRootRef = React.createRef<HTMLDivElement>()
    innerWrapperRef = React.createRef<HTMLDivElement>()
    stopWatching

    constructor(props) {
        super(props)
        this.state = {
            scale: 0,
            currentShiftLeft: 0,
            currentShiftTop: 0,
            startMoveShiftLeft: 0,
            startMoveShiftTop: 0,
            startMoveX: 0,
            startMoveY: 0,
            dragging: false
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

    componentDidMount() {
        document.documentElement.addEventListener('keydown', this.keyDown)
        document.documentElement.addEventListener('keyup', this.keyup)
        this.innerWrapperRef.current.addEventListener('mousedown', this.mousedown)
        window.addEventListener('resize', this.resize)
        this.stopWatching = autorun(() => {
            // sideWidth is required to react to change of this value
            // when component is dismounted there is not zoomedItem, but callback is called.
            // So check for zoomed item existence
            const {sideWidth, zoomedItem} = this.props.appState
            if (zoomedItem) {
                // Wait for components to render after sideWidth change so fitIntoView uses relevant value
                setTimeout(this.fitIntoView, 0)
            }
        })
    }

    componentWillUnmount() {
        document.documentElement.removeEventListener('keydown', this.keyDown)
        document.documentElement.removeEventListener('keyup', this.keyup)
        this.innerWrapperRef.current.removeEventListener('mousedown', this.mousedown)
        document.documentElement.removeEventListener('mouseup', this.mouseup)
        document.documentElement.removeEventListener('mousemove', this.mousemove)
        window.removeEventListener('resize', this.resize)
        this.stopWatching()
    }

    close() {
        this.props.appState.setZoomed(null)
    }

    render() {
        const {appState} = this.props
        const {zoomedItem, sideWidth} = appState
        const {type, url} = zoomedItem
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
                            ? type === 'img' && <img className='ZoomedView__container ZoomedView__img' src={url} />
                            : null}
                        {zoomedItem
                            ? type === 'video' && (
                                  <video controls className='ZoomedView__container ZoomedView__video' src={url} />
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
