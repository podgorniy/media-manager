import {MediaList} from './MediaList'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Upload} from './Upload'
import {ContextualActions} from './ContextualActions'
import {Zoom} from './Zoom'
import {IsLoading} from './IsLoading'
import {Auth} from './Auth'
import {CollapsedMenu} from './CollapsedMenu'

require('./Navigation.less')
require('./Layout.less')

@inject('appState')
@observer
export class Layout extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    private notifyAboutRender() {
        this.props.appState.incLayoutRerenderCount()
    }

    componentDidUpdate(): void {
        this.notifyAboutRender()
    }

    componentDidMount(): void {
        this.notifyAboutRender()
    }

    render() {
        const {appState} = this.props
        const {sideExpanded, isAuthenticated, sideWidth, currentCollectionUri} = appState
        let content
        const {concluded, pending, exists, passwordIsValid, passwordProtected} = appState.guestCollection
        if (isAuthenticated) {
            content = (
                <React.Fragment>
                    <IsLoading />
                    <div className='layout__content'>
                        <div
                            className={`layout__side ${
                                sideExpanded ? 'layout__side--expanded' : 'layout__side--collapsed'
                            }`}
                            style={{
                                width: sideExpanded ? sideWidth + 'px' : 'auto'
                            }}
                        >
                            {sideExpanded ? <ContextualActions /> : <CollapsedMenu />}
                        </div>
                        <div
                            className='layout__main'
                            style={{
                                marginLeft: sideWidth + 'px'
                            }}
                        >
                            <MediaList />
                        </div>
                    </div>
                    <Upload />
                    {<Zoom />}
                </React.Fragment>
            )
        } else if (currentCollectionUri) {
            if (!concluded) {
                content = 'Loading...' // TODO: improve
            } else if (
                concluded &&
                !pending &&
                exists &&
                ((passwordProtected && passwordIsValid) || !passwordProtected)
            ) {
                content = (
                    <React.Fragment>
                        <IsLoading />
                        <div>
                            <MediaList />
                            {<Zoom />}
                        </div>
                    </React.Fragment>
                )
            } else {
                content = `You don't have access or collection does not exist` // TODO: improve
            }
        } else {
            content = <Auth />
        }

        return <div className='layout'>{content}</div>
    }
}
