require('./MediaList.less')
import * as React from 'react'
import {Disposer, inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import Shuffle from 'shufflejs'
import {MediaListItem} from './MediaListItem'
import {isDev} from '../../common/lib'
import {autorun} from 'mobx'

const SHUFFLE_ANIMATION_DURATION = 250
const SCREEN_FRAME_DURATION = 17

interface IProps extends IAppState {}

@inject('appState')
@observer
export class MediaList extends React.Component<IProps, {}> {
    listRef = React.createRef<HTMLUListElement>()
    shuffle: Shuffle
    disposeLayoutWatcher: Disposer

    private _calcComponentHeight() {
        const componentHeight = this.listRef.current ? this.listRef.current.offsetHeight : 0
        this.props.appState.setMediaListFullHeight(componentHeight)
    }

    componentDidMount(): void {
        const node = this.listRef.current
        if (this.shuffle) {
            // is relevant as we will null value on unmount?
            throw Error('Shuffle already instantiated') // Should never throw
        }
        this.shuffle = new Shuffle(node, {
            speed: SHUFFLE_ANIMATION_DURATION
        })
        if (isDev()) {
            window['s'] = this.shuffle
        }
        const {appState} = this.props
        this.disposeLayoutWatcher = autorun(() => {
            if (appState.layoutRerenderCount) {
                this.shuffle.update()
            }
        })
        this.shuffle['on'](Shuffle.EventType.LAYOUT, () => {
            // Component height is available only after shuffle completes layout animation
            setTimeout(() => {
                this._calcComponentHeight()
            }, SHUFFLE_ANIMATION_DURATION + SCREEN_FRAME_DURATION * 2)
        })
    }

    componentWillUnmount(): void {
        this.shuffle.destroy()
        this.shuffle = null
        this.disposeLayoutWatcher()
        this.disposeLayoutWatcher = null
    }

    componentDidUpdate(): void {
        // TODO: optimize
        // update due to change of list items should reset items
        this.shuffle.resetItems()
        // update due to change of layout should just update
        this.shuffle.update()
        this._calcComponentHeight()
    }

    render() {
        const {appState} = this.props
        const widthClass = 'media-items-columns-' + appState.layoutColumnsCount
        return (
            <ul ref={this.listRef} className={`media-items ${widthClass}`}>
                {appState.media.map(({uuid}) => {
                    return (
                        <li key={uuid} className='media-item-wrapper-outer'>
                            <MediaListItem
                                uuid={uuid}
                                onLoad={() => {
                                    this.componentDidUpdate()
                                }}
                            />
                        </li>
                    )
                })}
            </ul>
        )
    }
}
