import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {IClientMediaItem} from '../../common/interfaces'
import copy from 'copy-to-clipboard'
import {shareMedia, unShareMedia} from '../api'

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
                    onClick={async () => {
                        copy(fullUrl)
                        const res = await shareMedia({uuid: uuid})
                        appState.refreshTags()
                        if (!res) {
                            alert('Ошибка. Не получилось расшарить')
                        }
                    }}
                    title='Скопировать ссылку на медиа'
                >
                    {sharedIndividually ? 'Скопировать ссылку' : 'Расшарить'}
                </button>
                <button
                    disabled={!sharedIndividually}
                    onClick={() => {
                        unShareMedia({uuid: uuid})
                        appState.refreshTags()
                    }}
                    title='Убрать медиа из публичного доступа'
                >
                    Отшарить обратно
                </button>
            </div>
        )
    }
}
