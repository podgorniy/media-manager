import * as React from 'react'
import {Disposer, inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import Shuffle from 'shufflejs'
import {MediaListItem} from './MediaListItem'
import {getType, isDev} from '../../common/lib'
import {autorun} from 'mobx'

@inject('appState')
@observer
export class MediaList extends React.Component<{} & IAppState, {}> {
    listRef = React.createRef<HTMLUListElement>()
    shuffle: Shuffle
    layoutWatcher: Disposer

    componentDidMount(): void {
        const {appState} = this.props
        const node = this.listRef.current
        if (this.shuffle) {
            // is relevant as we will null value on unmount?
            throw Error('Shuffle already instantiated') // Should never throw
        }
        this.shuffle = new Shuffle(node, {})
        if (isDev()) {
            window['s'] = this.shuffle
        }
        this.layoutWatcher = autorun(() => {
            if (appState.layoutRerenderCount) {
                this.shuffle.update()
            }
        })
    }

    componentWillUnmount(): void {
        this.shuffle.destroy()
        this.shuffle = null
        this.layoutWatcher()
        this.layoutWatcher = null
    }

    componentDidUpdate(): void {
        // update due to change of list items should reset items
        // this.shuffle.resetItems()
        // update due to change of layout should just update
        this.shuffle.update()
    }

    render() {
        const {appState} = this.props
        const widthClass = 'media-items-columns-' + appState.columnsCount
        return (
            <ul ref={this.listRef} className={`media-items ${widthClass}`}>
                {appState.media.map(({url, uuid, selected}) => {
                    return (
                        <li key={uuid} className='media-item-wrapper-outer'>
                            <div className={`media-item-wrapper-inner ${selected ? 'selected' : ''}`}>
                                <MediaListItem uuid={uuid} url={url} type={getType(url)} />
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }
}
