import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {addToCollection, removeFromCollection} from '../api'
import {autorun} from 'mobx'

interface IProps {}

interface IState {
    selectedCollection: string
}

@inject('appState')
@observer
export class CollectionsControls extends React.Component<IProps & IAppState, IState> {
    state = {
        selectedCollection: ''
    }

    constructor(props) {
        super(props)
    }

    _stopEnsureCollectionSelected
    _stopSetViewedAsSelected

    componentDidMount() {
        // This will ensure that at least some collection is selected
        this._stopEnsureCollectionSelected = autorun(() => {
            const {appState} = this.props
            const collectionsCount = appState.collections.length
            const thisComponentSelectedCollection = this.state.selectedCollection
            if (thisComponentSelectedCollection) {
                this._stopEnsureCollectionSelected()
                return
            }
            if (!thisComponentSelectedCollection && collectionsCount) {
                // none collections is selected in this component, but some collections are know
                this.setState({
                    selectedCollection: appState.collections[0]._id
                })
                this._stopEnsureCollectionSelected()
            }
        })

        // Select currently active collection bu default
        this._stopSetViewedAsSelected = autorun(() => {
            const {appState} = this.props
            if (appState.currentlyViewedCollection && appState.currentlyViewedCollection._id) {
                this.setState({
                    selectedCollection: appState.currentlyViewedCollection._id
                })
            }
        })
    }

    componentWillUnmount() {
        this._stopEnsureCollectionSelected()
        this._stopSetViewedAsSelected()
    }

    render() {
        const {appState} = this.props
        let selectedCollectionId = this.state.selectedCollection
        const selectedCollection = appState.collections.reduce((found, item) => {
            if (found) {
                return found
            }
            if (item._id === selectedCollectionId) {
                return item
            }
        }, null)
        let allSelectedAreInCollection = false
        let allSelectedAreNotInCollection = false
        const selectedUUIDs = appState.selectedUUIDs
        if (selectedCollection && selectedCollection.media) {
            const mediaOfSelectedCollection = selectedCollection.media
            if (selectedCollection.media.length === 0) {
                allSelectedAreNotInCollection = true
            } else {
                allSelectedAreInCollection = selectedUUIDs.every((s) => mediaOfSelectedCollection.indexOf(s) !== -1)
                allSelectedAreNotInCollection = selectedUUIDs.every((s) => mediaOfSelectedCollection.indexOf(s) === -1)
            }
        }
        return (
            <div
                style={{
                    display: appState.selectedUUIDs.length ? 'block' : 'none'
                }}
            >
                <select
                    value={selectedCollectionId}
                    onChange={(e) => {
                        this.setState({
                            selectedCollection: e.target.value
                        })
                    }}
                >
                    {appState.collections.map(({_id, title}) => {
                        return (
                            <option value={_id} key={_id}>
                                {title}
                            </option>
                        )
                    })}
                </select>
                <button
                    disabled={allSelectedAreInCollection}
                    onClick={async () => {
                        await addToCollection({
                            collectionId: selectedCollectionId,
                            items: appState.selectedUUIDs
                        })
                        await appState.refreshCollectionsList()
                    }}
                >
                    Добавить
                </button>
                <button
                    disabled={allSelectedAreNotInCollection}
                    onClick={async () => {
                        await removeFromCollection({
                            collectionId: selectedCollectionId,
                            items: appState.selectedUUIDs
                        })
                        await appState.refreshCollectionsList()
                    }}
                >
                    Убрать
                </button>
            </div>
        )
    }
}
