import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {RouterLink} from './RouterLink'
import {deleteCollection, renameCollection, shareCollection, unShareCollection} from '../api'
import {Button, Input} from 'semantic-ui-react'
import './Collections2.css'
import {CollectionPublicPassword} from './CollectionPublicPassword'
import {DownloadMedia} from './DownloadMedia'
import copy = require('copy-to-clipboard')

interface IProps {}

interface IState {
    text: string
    disabled: boolean
}

@inject('appState')
@observer
export class Collections2 extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            disabled: false
        }
    }

    componentDidMount(): void {
        this.props.appState.refreshCollections()
    }

    render() {
        const {appState} = this.props
        const matchedCollections = appState.collections.filter((collection) => {
            return collection.title === this.state.text
        })
        const collectionIdToDelete = (matchedCollections || [])[0]
        return (
            <div>
                <form
                    onSubmit={async (event) => {
                        event.preventDefault()
                    }}
                >
                    <Input
                        size='mini'
                        list='collections'
                        placeholder='Collection name'
                        value={this.state.text}
                        onChange={(e) => {
                            this.setState({text: e.target.value})
                        }}
                    >
                        <input />
                        <datalist id='collections'>
                            {appState.collections.map(({title, _id}) => {
                                return <option value={title} key={_id} />
                            })}
                        </datalist>
                        <Button
                            className='Collections2__first-button'
                            compact
                            size='small'
                            disabled={!!collectionIdToDelete}
                            onClick={async (event) => {
                                event.preventDefault()
                                this.setState({disabled: true})
                                const res = await appState.createCollection(this.state.text)
                                this.setState({disabled: false})
                                if (res) {
                                    this.setState({text: ''})
                                    appState.refreshCollections()
                                }
                            }}
                        >
                            New
                        </Button>
                        <Button
                            compact
                            size='small'
                            disabled={!collectionIdToDelete}
                            onClick={(event) => {
                                event.preventDefault()
                                appState.deleteCollection(collectionIdToDelete)
                            }}
                        >
                            Delete
                        </Button>
                    </Input>
                </form>
                <div>
                    {appState.collections.map((collection) => {
                        const collectionUrl = appState.router.getFullUrl({
                            replace: {pathSegments: ['c', collection.uri]}
                        })
                        let collectionLinkUrl
                        let isActiveCollection =
                            appState.router.pathSegments.length >= 2 &&
                            appState.router.pathSegments[1] === collection.uri
                        if (isActiveCollection) {
                            collectionLinkUrl = appState.router.getFullUrl({replace: {pathSegments: []}})
                        } else {
                            collectionLinkUrl = collectionUrl
                        }
                        return (
                            <React.Fragment key={collection.uri}>
                                <h2 className='Collections2__collection-link'>
                                    <RouterLink
                                        url={collectionLinkUrl}
                                        className={isActiveCollection ? 'Collections2__collection-link-active' : ''}
                                    >
                                        {collection.title}
                                    </RouterLink>
                                </h2>
                                <div className='Collections2__collection-actions'>
                                    <Button
                                        compact
                                        size='small'
                                        onClick={async () => {
                                            if (confirm(`Confirm deletion of collection "${collection.title}"`)) {
                                                await deleteCollection({collectionId: collection._id})
                                                await appState.refreshCollections()
                                                if (isActiveCollection) {
                                                    appState.router.replaceUrl(
                                                        appState.router.getFullUrl({replace: {pathSegments: []}})
                                                    )
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        compact
                                        size='small'
                                        onClick={async () => {
                                            const newTitle = (
                                                prompt('New title of the collection', collection.title) || ''
                                            ).trim()
                                            if (newTitle) {
                                                await renameCollection({
                                                    collectionId: collection._id,
                                                    newTitle: newTitle
                                                })
                                                appState.refreshCollections()
                                            }
                                        }}
                                    >
                                        Rename
                                    </Button>
                                    <Button
                                        compact
                                        size='small'
                                        onClick={async () => {
                                            copy(collectionUrl)
                                            await shareCollection({id: collection._id})
                                            appState.refreshCollections()
                                        }}
                                    >
                                        {collection.public ? 'Copy link' : 'Share'}
                                    </Button>
                                    <DownloadMedia collectionId={collection._id} count={collection.media.length} />
                                    {collection.public ? (
                                        <Button
                                            compact
                                            size='small'
                                            onClick={async () => {
                                                await unShareCollection({id: collection._id})
                                                appState.refreshCollections()
                                            }}
                                        >
                                            Unshare
                                        </Button>
                                    ) : null}
                                </div>
                                {collection.public ? <CollectionPublicPassword collection={collection} /> : null}
                                <div className='Collections2__separator'></div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        )
    }
}
