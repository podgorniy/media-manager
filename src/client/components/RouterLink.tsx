import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

interface IProps {
    url: string
    className?: string
}

interface IState {}

@inject('appState')
@observer
export class RouterLink extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <a
                href={this.props.url}
                className={this.props.className ? this.props.className : ''}
                onClick={(event) => {
                    event.preventDefault()
                    const linkTag = event.target as HTMLAnchorElement
                    appState.router.replaceUrl(linkTag.href)
                }}
            >
                {this.props.children}
            </a>
        )
    }
}
