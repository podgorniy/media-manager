import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { autorun } from 'mobx'
import { Button, Dropdown } from 'semantic-ui-react'
import './CollectionsControls.css'

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
        this._stopEnsureCollectionSelected = autorun((comp) => {
            const {appState} = this.props
            const collectionsCount = appState.collections.length
            const thisComponentSelectedCollection = this.state.selectedCollection
            if (thisComponentSelectedCollection) {
                comp.dispose()
                return
            }
            if (!thisComponentSelectedCollection && collectionsCount) {
                // none collections is selected in this component, but some collections are know
                this.setState({
                    selectedCollection: appState.collections[0]._id
                })
                comp.dispose()
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
            <div className='CollectionsControls'>
                <div className='CollectionsControls__item CollectionsControls__item--grow'>
                    <div className="ui button compact tiny dropdown-wrapper">
                        <Dropdown
                            compact
                            fluid
                            search
                            selection
                            value={selectedCollectionId}
                            onChange={(event) => {
                                this.setState({
                                    selectedCollection: (event.target as HTMLSelectElement).value
                                })
                            }}
                            options={appState.collections.map((collection, index) => {
                                return {
                                    key: collection._id,
                                    text: collection.title,
                                    value: collection._id
                                }
                            })}
                        />
                    </div>
                </div>
                <div className='CollectionsControls__item CollectionsControls__item--buttons'>
                    <Button.Group className='CollectionsControls__buttons'>
                        <Button
                            compact
                            disabled={allSelectedAreInCollection}
                            onClick={() => {
                                appState.addSelectedToCollection(this.state.selectedCollection)
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            compact
                            disabled={allSelectedAreNotInCollection}
                            onClick={() => {
                                appState.removeSelectedFromCollection(selectedCollectionId)
                            }}
                        >
                            Remove
                        </Button>
                    </Button.Group>
                </div>
            </div>
        )
    }
}
