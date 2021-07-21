import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {ICollectionItem} from '../../common/interfaces'
import {Checkbox, Input} from 'semantic-ui-react'
import {updateCollection} from '../api'
import './CollectionPublicPassword.css'

interface IProps {
    collection: ICollectionItem
}

interface IState {
    chooseToAddPassword: boolean
    loading: boolean
    inputPasswordText: string
}

@inject('appState')
@observer
export class CollectionPublicPassword extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            chooseToAddPassword: false,
            inputPasswordText: this.props.collection.publicPassword
        }
        this.attemptToSetCollectionPass = this.attemptToSetCollectionPass.bind(this)
    }

    private async attemptToSetCollectionPass() {
        const {appState, collection} = this.props
        const {uri, publicPassword} = collection
        const {inputPasswordText} = this.state
        if (!inputPasswordText) {
            this.setState({
                chooseToAddPassword: false
            })
        }
        if (publicPassword === inputPasswordText) {
            return
        }
        this.setState({
            loading: true
        })
        await updateCollection({
            uri: uri,
            publicPassword: inputPasswordText
        })
        await appState.refreshCollections()
        this.setState({
            loading: false
        })
    }

    render() {
        const {appState, collection} = this.props
        const {uri, publicPassword} = collection
        const {inputPasswordText} = this.state
        return (
            <div className='CollectionPublicPassword'>
                <Checkbox
                    className='CollectionPublicPassword__toggle'
                    disabled={this.state.loading}
                    onChange={async (event, {checked}) => {
                        if (checked) {
                            this.setState({
                                chooseToAddPassword: true
                            })
                        } else {
                            this.setState({
                                loading: true,
                                chooseToAddPassword: false
                            })
                            await updateCollection({
                                uri: uri,
                                publicPassword: ''
                            })
                            await appState.refreshCollections()
                            this.setState({
                                loading: false
                            })
                        }
                    }}
                    checked={!!collection.publicPassword || this.state.chooseToAddPassword}
                    label='Password'
                />
                <Input
                    size='mini'
                    disabled={this.state.loading}
                    loading={this.state.loading}
                    style={{
                        display: !(collection.publicPassword || this.state.chooseToAddPassword) ? 'none' : ''
                    }}
                    autoFocus={this.state.chooseToAddPassword}
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            this.attemptToSetCollectionPass()
                        }
                    }}
                    onBlur={async () => {
                        this.attemptToSetCollectionPass()
                    }}
                    placeholder='Password for public collection'
                    type='text'
                    onChange={(event, data) => {
                        this.setState({
                            inputPasswordText: data.value.trim()
                        })
                    }}
                    value={inputPasswordText === publicPassword ? publicPassword : inputPasswordText}
                />
            </div>
        )
    }
}
