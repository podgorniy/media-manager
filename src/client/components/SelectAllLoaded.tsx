import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { Button } from 'semantic-ui-react'

interface IProps {}
interface IState {}

@inject('appState')
@observer
export class SelectAllLoaded extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <Button
                compact
                size='small'
                onClick={(event) => {
                    event.preventDefault()
                    appState.selectAllLoaded()
                }}
            >
                Select all loaded
            </Button>
        )
    }
}
