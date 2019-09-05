import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {IClientMediaItem} from '../../common/interfaces'
import copy from 'copy-to-clipboard'

interface IProps {
    mediaItem: IClientMediaItem
}

interface IState {}

@inject('appState')
@observer
export class ShareMediaItem extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, mediaItem} = this.props
        const {sharedIndividually, uuid} = mediaItem
        const fullUrl = `${location.protocol}//${location.host}${mediaItem.url}`
        return (
            <div>
                <button
                    onClick={() => {
                        copy(fullUrl)
                        appState.shareMedia(uuid)
                    }}
                    title='Скопировать ссылку на медиа'
                >
                    {sharedIndividually ? 'Скопировать ссылку' : 'Поделиться'}
                </button>
                <button
                    disabled={!sharedIndividually}
                    onClick={() => {
                        appState.unShareMedia(uuid)
                    }}
                    title='Убрать медиа из публичного доступа'
                >
                    Закрыть доступ
                </button>
            </div>
        )
    }
}
