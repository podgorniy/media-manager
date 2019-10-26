import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { Button, Input } from 'semantic-ui-react'

interface IProps {}

interface IState {
    val: string
}

@inject('appState')
@observer
export class Tagging extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            val: ''
        }
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <Input
                    size='mini'
                    list='tags'
                    action={
                        <Button
                            compact
                            size='tiny'
                            disabled={!this.state.val}
                            onClick={async () => {
                                await appState.addTagForSelectedRemotely([this.state.val])
                                this.setState({
                                    val: ''
                                })
                            }}
                        >
                            Add
                        </Button>
                    }
                />
                <datalist id='tags'>
                    {appState.tags.map(({name}) => {
                        return <option value={name} key={name} />
                    })}
                </datalist>
            </div>
        )
    }
}
