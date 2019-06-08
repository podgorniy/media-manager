import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {RouterLink} from './RouterLink'
import {deleteCollection, renameCollection} from '../api'

interface IProps {}

interface IState {
    text: string
    disabled: boolean
}

@inject('appState')
@observer
export class Collectionsss extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            disabled: false
        }
    }

    componentDidMount(): void {
        this.props.appState.refreshCollectionsList()
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <h2>Коллекции</h2>
                <form
                    onSubmit={async (event) => {
                        event.preventDefault()
                        this.setState({disabled: true})
                        const res = await appState.createCollection(this.state.text)
                        this.setState({disabled: false})
                        if (res) {
                            this.setState({text: ''})
                            appState.refreshCollectionsList()
                        }
                    }}
                >
                    <input
                        value={this.state.text}
                        type='text'
                        onChange={(event) => {
                            this.setState({
                                text: event.target.value
                            })
                        }}
                        placeholder='Название новой коллекции'
                        disabled={this.state.disabled}
                    />{' '}
                    <button disabled={this.state.disabled}>Создать</button>
                </form>
                <ul>
                    {appState.collections.map((collection) => {
                        let collectionUrl = appState.router.getFullUrl({replace: {pathSegments: ['c', collection.uri]}})
                        let isActiveCollection = false
                        if (appState.router.pathSegments.length >= 2) {
                            isActiveCollection = appState.router.pathSegments[1] === collection.uri
                            if (isActiveCollection) {
                                collectionUrl = appState.router.getFullUrl({replace: {pathSegments: []}})
                            }
                        }
                        return (
                            <li key={collection.uri}>
                                <button
                                    onClick={async () => {
                                        if (confirm(`Удалить коллекцию "${collection.title}" безвозвратно?`)) {
                                            await deleteCollection({collectionId: collection._id})
                                            await appState.refreshCollectionsList()
                                            if (isActiveCollection) {
                                                appState.router.replaceUrl(
                                                    appState.router.getFullUrl({replace: {pathSegments: []}})
                                                )
                                            }
                                        }
                                    }}
                                >
                                    Удалить
                                </button>
                                <button
                                    onClick={async () => {
                                        const newTitle = (prompt('Новое имя коллекции', collection.title) || '').trim()
                                        if (newTitle) {
                                            await renameCollection({
                                                collectionId: collection._id,
                                                newTitle: newTitle
                                            })
                                            appState.refreshCollectionsList()
                                        }
                                    }}
                                >
                                    Переименовать
                                </button>
                                <RouterLink url={collectionUrl} className={isActiveCollection ? 'remove' : 'with'}>
                                    {collection.title}
                                </RouterLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
