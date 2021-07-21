import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {RouterLink} from './RouterLink'

require('./TagLink.less')

interface IProps {
    href: string
}

interface IState {}

@inject('appState')
@observer
export class TagLink extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, href} = this.props
        return (
            <RouterLink url={href} behaviour='replace'>
                {this.props.children}
            </RouterLink>
        )
    }
}
