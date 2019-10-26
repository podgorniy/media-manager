import { MediaList } from './MediaList'
import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { DragNDropUpload } from './DragNDropUpload'
import { ContextualActions } from './ContextualActions'
import { Zoom } from './Zoom'
import { IsLoading } from './IsLoading'
import { Auth } from './Auth'
import { CollapsedMenu } from './CollapsedMenu'

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
        const [_, collectionUrl] = appState.router.pathSegments
        const {sideExpanded, isAuthenticated, sideWidth} = appState
        let content
        if (isAuthenticated) {
            content = (
                <React.Fragment>
                    <IsLoading />
                    <div className='layout__content'>
                        <div
                            className='layout__side'
                            style={{
                                width: sideWidth + 'px'
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
                    <DragNDropUpload />
                    {<Zoom />}
                </React.Fragment>
            )
        } else if (collectionUrl) {
            content = (
                <React.Fragment>
                    <IsLoading />
                    <div>
                        {appState.currentlyViewedCollectionId}
                        {appState.currentlyViewedCollection}
                        <MediaList />
                        {<Zoom />}
                    </div>
                </React.Fragment>
            )
        } else {
            content = <Auth />
        }

        return <div className='layout'>{content}</div>
    }
}
