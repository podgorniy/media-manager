import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { TagLink } from './TagLink'

interface IProps {}

interface IState {
    inputValue: string
    submissionDisabled: boolean
}

@inject('appState')
@observer
export class TagsControls extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: '',
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
        await appState.addTagForSelectedRemotely([this.state.inputValue])
        this.setState({
            inputValue: '',
            submissionDisabled: false
        })
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <input
                    type='text'
                    placeholder='Tag'
                    value={this.state.inputValue}
                    onChange={(event) => {
                        this.setState({
                            inputValue: event.target.value.trim().toLowerCase()
                        })
                    }}
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            this._attemptSubmit()
                        }
                    }}
                />
                <button
                    onClick={(event) => {
                        event.preventDefault()
                        this._attemptSubmit()
                    }}
                    disabled={this.state.submissionDisabled}
                >
                    add
                </button>
                {appState.selectedItemsTags.length ? (
                    <ul>
                        {appState.selectedItemsTags.map((tag) => {
                            return (
                                <li key={tag}>
                                    <button
                                        onClick={(event) => {
                                            event.preventDefault()
                                            appState.removeTagFromSelectedRemotely(tag)
                                        }}
                                    >
                                        ×
                                    </button>
                                    <TagLink href={tag} />
                                </li>
                            )
                        })}
                    </ul>
                ) : null}
            </div>
        )
    }
}
