import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

interface IProps {}
interface IState {}

@inject('appState')
@observer
export class UploadBtn extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <button
                    onClick={() => {
                        appState.toggleUploadVisibility(true)
                    }}
                >
                    Upload
                </button>
            </div>
        )
    }
}
