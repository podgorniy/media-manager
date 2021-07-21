import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button} from 'semantic-ui-react'

interface IProps {
    UUIDs: Array<string>
}

interface IState {
    loading: boolean
}

@inject('appState')
@observer
export class DeleteMedia extends React.Component<IProps & IAppState, IState> {
    private mounted = false

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    render() {
        const {appState} = this.props
        // Have to make a copy as array is being modified during the loop (with toggleSelected method)
        const UUIDsToDelete = [...this.props.UUIDs]
        const selectedItemsCount = UUIDsToDelete.length
        return (
            <Button
                disabled={this.state.loading}
                size='small'
                compact
                onClick={async () => {
                    if (
                        confirm(
                            `Do you want to irreversibly delete ${selectedItemsCount} item${
                                selectedItemsCount === 1 ? '' : 's'
                            }?`
                        )
                    ) {
                        try {
                            this.setState({loading: true})
                            UUIDsToDelete.forEach((uuid) => {
                                // Remove zoom if zoomed item was deleted
                                if (appState.zoomedItemId === uuid) {
                                    appState.setZoomed(null)
                                }
                                // Deselect item if selected item was among deleted
                                if (appState.selectedUUIDs.indexOf(uuid) !== -1) {
                                    appState.toggleSelected(uuid)
                                }
                            })
                            await appState.rpc.deleteMedia(UUIDsToDelete)
                            await appState.refreshMedia()
                            await appState.refreshTags()
                        } catch (error) {
                            console.error(error)
                        } finally {
                            // Otherwise react cries about state modification of unmounted component
                            if (this.mounted) {
                                this.setState({loading: false})
                            }
                        }
                    }
                }}
            >
                {`Delete ${UUIDsToDelete.length}`}
            </Button>
        )
    }
}
