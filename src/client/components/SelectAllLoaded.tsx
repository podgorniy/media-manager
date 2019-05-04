import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'

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
            <button
                onClick={(event) => {
                    event.preventDefault()
                    appState.selectAllLoaded()
                }}
            >
                Выбрать все подгруженные
            </button>
        )
    }
}
