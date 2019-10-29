import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

type RouterLinkBehaviour = 'replace' | 'push'

interface IProps {
    url: string
    className?: string
    behaviour?: RouterLinkBehaviour
}

interface IState {}

@inject('appState')
@observer
export class RouterLink extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, url} = this.props
        return (
            <a
                href={url}
                className={this.props.className ? this.props.className : ''}
                onClick={(event) => {
                    event.preventDefault()
                    const linkBehaviour: RouterLinkBehaviour = this.props.behaviour ? this.props.behaviour : 'push'
                    if (linkBehaviour === 'push') {
                        appState.router.pushUrl(url)
                    } else if (linkBehaviour === 'replace') {
                        appState.router.replaceUrl(url)
                    } else {
                        console.error('Unknown router link behaviour')
                    }
                }}
            >
                {this.props.children}
            </a>
        )
    }
}
