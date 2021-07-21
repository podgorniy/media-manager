import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

require('./IsLoading.less')

interface IProps {}
interface IState {}

@inject('appState')
@observer
export class IsLoading extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div
                className='
                    IsLoading
                    IsLoading--striped
                '
                style={{
                    display: appState.isLoading ? 'block' : 'none'
                }}
            />
        )
    }
}
