require('./MediaList.less')
import * as React from 'react'
import {Disposer, inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import Shuffle from 'shufflejs'
import {MediaListItem} from './MediaListItem'
import {getTypeOfDoc, isDev} from '../../common/lib'
import {autorun} from 'mobx'

@inject('appState')
@observer
export class MediaList extends React.Component<{} & IAppState, {}> {
    listRef = React.createRef<HTMLUListElement>()
    shuffle: Shuffle
    disposeLayoutWatcher: Disposer

    private _onWindowScroll = (event) => {
        console.log(event)
    }

    private addWindowsScrollHandlers() {
        window.addEventListener('scroll', this._onWindowScroll, false)
    }

    private removeWindowsScrollHandlers() {
        window.removeEventListener('scroll', this._onWindowScroll, false)
    }

    componentDidMount(): void {
        this.addWindowsScrollHandlers()
        const node = this.listRef.current
        if (this.shuffle) {
            // is relevant as we will null value on unmount?
            throw Error('Shuffle already instantiated') // Should never throw
        }
        this.shuffle = new Shuffle(node, {})
        if (isDev()) {
            window['s'] = this.shuffle
        }
        const {appState} = this.props
        this.disposeLayoutWatcher = autorun(() => {
            if (appState.layoutRerenderCount) {
                this.shuffle.update()
            }
        })
    }

    componentWillUnmount(): void {
        this.removeWindowsScrollHandlers()
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
