import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button} from 'semantic-ui-react'

interface IProps {}
interface IState {
    loading: boolean
}

@inject('appState')
@observer
export class DeleteMedia extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        const {appState} = this.props
        const {selectedUUIDs} = appState
        const selectedItemsCount = selectedUUIDs.length
        return (
            <Button
                disabled={this.state.loading}
                size='small'
                compact
                onClick={async () => {
                    if (confirm(`Do you want to irreversibly delete ${selectedItemsCount} items?`)) {
                        try {
                            this.setState({loading: true})
                            await appState.rpc.deleteMedia(selectedUUIDs)
                            await appState.refreshMedia()
                            await appState.unselectAll()
                        } catch (error) {
                            this.setState({loading: false})
                            console.error(error)
                        }
                    }
                }}
            >
                Delete {selectedUUIDs.length} elements
            </Button>
        )
    }
}
