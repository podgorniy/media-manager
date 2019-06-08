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
        const {appState} = this.props
        return (
            <a
                href={this.props.url}
                className={this.props.className ? this.props.className : ''}
                onClick={(event) => {
                    event.preventDefault()
                    const linkTag = event.target as HTMLAnchorElement
                    const linkBehaviour: RouterLinkBehaviour = this.props.behaviour ? this.props.behaviour : 'push'
                    if (linkBehaviour === 'push') {
                        appState.router.pushUrl(linkTag.href)
                    } else if (linkBehaviour === 'replace') {
                        appState.router.replaceUrl(linkTag.href)
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
