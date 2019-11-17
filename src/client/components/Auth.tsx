import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button, Form, Input, Message, Modal} from 'semantic-ui-react'
import {authenticate} from '../api'

interface IProps {}

interface IState {
    loading: boolean
    error: boolean
    name: string
    password: string
}

@inject('appState')
@observer
export class Auth extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            loading: false,
            name: '',
            password: ''
        }
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <Modal open={true} closeOnDimmerClick={false} closeOnEscape={false}>
                    <Modal.Content>
                        <Form
                            error={this.state.error}
                            loading={this.state.loading}
                            onSubmit={async (event) => {
                                event.preventDefault()
                                this.setState({
                                    error: false,
                                    loading: true
                                })
                                try {
                                    const authResults = await authenticate({
                                        password: this.state.password,
                                        userName: this.state.name
                                    })
                                    this.setState({
                                        loading: false
                                    })
                                    if (authResults.success) {
                                        appState.setAuthenticated(true)
                                    } else {
                                        this.setState({
                                            error: true
                                        })
                                    }
                                } catch (error) {
                                    console.error(error)
                                    this.setState({
                                        error: true,
                                        loading: false
                                    })
                                }
                            }}
                        >
                            <Message error header='Failed to authenticate' />
                            <Form.Field>
                                <Input
                                    value={this.state.name}
                                    onChange={(event) => {
                                        this.setState({
                                            name: event.target.value,
                                            error: false
                                        })
                                    }}
                                    size='huge'
                                    autoFocus
                                    type='text'
                                    placeholder='User name'
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    value={this.state.password}
                                    onChange={(event) => {
                                        this.setState({
                                            password: event.target.value,
                                            error: false
                                        })
                                    }}
                                    size='huge'
                                    type='password'
                                    placeholder='Password'
                                />
                            </Form.Field>
                            <Button size='huge' primary>
                                Authenticate
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}
