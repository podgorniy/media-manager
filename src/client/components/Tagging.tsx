import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button, Input} from 'semantic-ui-react'
import {UUID} from '../../common/interfaces'

interface IProps {
    mediaUUIDs: Array<UUID>
}

interface IState {
    val: string
    submissionDisabled: boolean
}

@inject('appState')
@observer
export class Tagging extends React.Component<IProps & IAppState, IState> {
    inputRef = React.createRef<Input>()

    constructor(props) {
        super(props)
        this.state = {
            val: '',
            submissionDisabled: false
        }
    }

    private async _attemptSubmit() {
        const {appState} = this.props
        const tagName = this.state.val.trim()
        if (!tagName) {
            return
        }
        this.setState({
            submissionDisabled: true
        })
        await appState.addTagFor([tagName], this.props.mediaUUIDs)
        this.setState({
            val: '',
            submissionDisabled: false
        })
        this.inputRef.current.focus()
    }

    render() {
        const {appState} = this.props
        const tag = this.state.val.trim()
        const relevantMedia = appState.media.filter((m) => {
            return this.props.mediaUUIDs.indexOf(m.uuid) !== -1
        })
        const everyMediaHasCurrentTag = relevantMedia.every((m) => {
            return m.tags.indexOf(tag) !== -1
        })
        const everyMediaDoesNotHaveCurrentTag = relevantMedia.every((m) => {
            return m.tags.indexOf(tag) === -1
        })
        return (
            <div>
                <Input
                    size='mini'
                    list='tags'
                    placeholder='Add tag'
                    value={this.state.val}
                    ref={this.inputRef}
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
                >
                    <input />

                    <datalist id='tags'>
                        {appState.tags.map(({name}) => {
                            return <option value={name} key={name} />
                        })}
                    </datalist>
                    <Button
                        compact
                        size='small'
                        disabled={!this.state.val || this.state.submissionDisabled || everyMediaHasCurrentTag}
                        onClick={async () => {
                            this._attemptSubmit()
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        compact
                        size='small'
                        disabled={!this.state.val || this.state.submissionDisabled || everyMediaDoesNotHaveCurrentTag}
                        onClick={async () => {
                            this.setState({
                                submissionDisabled: true
                            })
                            await appState.removeTagFrom(tag, this.props.mediaUUIDs)
                            this.setState({
                                submissionDisabled: false,
                                val: ''
                            })
                            this.inputRef.current.focus()
                        }}
                    >
                        Remove
                    </Button>
                </Input>
            </div>
        )
    }
}
