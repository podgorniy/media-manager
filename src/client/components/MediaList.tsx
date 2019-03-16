require('./MediaList.less')
import * as React from 'react'
import {Disposer, inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import Shuffle from 'shufflejs'
import {MediaListItem} from './MediaListItem'
import {getTypeOfDoc, isDev} from '../../common/lib'
import {autorun} from 'mobx'

const SHUFFLE_ANIMATION_DURATION = 250
const SCREEN_FRAME_DURATION = 17

@inject('appState')
@observer
export class MediaList extends React.Component<{} & IAppState, {}> {
    listRef = React.createRef<HTMLUListElement>()
    shuffle: Shuffle
    disposeLayoutWatcher: Disposer

    private _calcComponentHeight() {
        this.props.appState.setMediaListFullHeight(this.listRef.current.offsetHeight)
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
        const widthClass = 'media-items-columns-' + appState.columnsCount
        return (
            <ul ref={this.listRef} className={`media-items ${widthClass}`}>
                {appState.media.map(({url, uuid, selected, type}) => {
                    return (
                        <li key={uuid} className='media-item-wrapper-outer'>
                            <div
                                className={`
                                        media-item-wrapper-inner
                                        ${selected ? 'selected' : ''}
                                        ${appState.focusedId === uuid ? 'focused' : ''}
                                    `}
                            >
                                <MediaListItem
                                    uuid={uuid}
                                    url={url}
                                    type={getTypeOfDoc(type)}
                                    onLoad={() => {
                                        this.componentDidUpdate()
                                    }}
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }
}
