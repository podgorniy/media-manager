import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {authenticate} from '../api'

interface ILoginFormState {
    userName: string
    password: string
}

@inject('appState')
@observer
export class LoginForm extends React.Component<{} & IAppState, ILoginFormState> {
    state: ILoginFormState = {
        userName: '',
        password: ''
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <form
                    action='/'
                    onSubmit={async (event) => {
                        event.preventDefault()
                        const authSuccess = await authenticate(this.state)
                        if (authSuccess.success) {
                            appState.setAuthenticated({userName: authSuccess.userName})
                        } else {
                            alert('Failed to authenticate')
                        }
                    }}
                >
                    <input
                        value={this.state.userName}
                        onChange={(event) => {
                            this.setState({userName: event.target.value})
                        }}
                        type='text'
                        name='username'
                        placeholder='User name'
                    />
                    <input
                        value={this.state.password}
                        onChange={(event) => {
                            this.setState({password: event.target.value})
                        }}
                        type='password'
                        name='password'
                        placeholder='Password'
                    />
                    <button>Login</button>
                </form>
            </div>
        )
    }
}
