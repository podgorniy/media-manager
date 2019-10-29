import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button, Input} from 'semantic-ui-react'

interface IProps {}

interface IState {
    val: string
    submissionDisabled: boolean
}

@inject('appState')
@observer
export class Tagging extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            val: '',
            submissionDisabled: false
        }
    }

    private async _attemptSubmit() {
        const {appState} = this.props
        if (this.state.submissionDisabled) {
            return
        }
        this.setState({
            submissionDisabled: true
        })
        await appState.addTagForSelectedRemotely([this.state.val])
        this.setState({
            val: '',
            submissionDisabled: false
        })
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <Input
                    placeholder='Add tag'
                    disabled={this.state.submissionDisabled}
                    onChange={(event) => {
                        this.setState({
                            val: event.target.value
                        })
                    }}
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            this._attemptSubmit()
                        }
                    }}
                    value={this.state.val}
                    size='mini'
                    list='tags'
                    action={
                        <Button
                            compact
                            size='tiny'
                            disabled={!this.state.val || this.state.submissionDisabled}
                            onClick={async () => {
                                this._attemptSubmit()
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
