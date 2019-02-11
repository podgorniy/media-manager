import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'
import Shuffle from 'shufflejs'

function getType(url: string): string {
    if (/mp4|qt/.test(url)) {
        return 'video'
    } else {
        return 'img'
    }
}

@inject('appState')
@observer
export class UserMedia extends React.Component<{} & IAppState, {}> {
    listRef = React.createRef<HTMLUListElement>()
    shuffle: any

    componentDidMount(): void {
        const node = this.listRef.current
        if (this.shuffle) {
            // is relevant as we will null value on unmount?
            throw Error('Shuffle already instantiated') // Should never throw
        }
        this.shuffle = new Shuffle(node, {})
    }

    componentWillUnmount(): void {
        this.shuffle.destroy()
        this.shuffle = null
    }

    componentDidUpdate(prevProps: Readonly<{} & IAppState>, prevState: Readonly<{}>, snapshot?: any): void {
        this.shuffle.resetItems()
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <ul ref={this.listRef} className='media-items'>
                    {appState.userMedia.map(({url, fileName}, i) => {
                        return (
                            <li key={i} className='media-item-wrapper'>
                                {getType(url) === 'img' ? <img src={url} className='media-image' /> : <video width='' src={url} className='media-video' controls />}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
