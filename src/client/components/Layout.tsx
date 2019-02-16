import {MediaList} from './MediaList'
import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {Navigation} from './Navigation'
import {DragNDropUpload} from './DragNDropUpload'
import {ToggleSidebar} from './ToggleSidebar'

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

    componentWillMount(): void {
        this.notifyAboutRender()
    }

    render() {
        const {appState} = this.props
        return (
            <div className='layout'>
                <div className='layout__navigation'>
                    <Navigation />
                </div>
                <div className='layout__content'>
                    <div
                        className='layout__side'
                        style={{
                            width: appState.sideWidth + 'px'
                        }}
                    >
                        <ToggleSidebar />
                    </div>
                    <div
                        className='layout__main'
                        style={{
                            marginLeft: appState.sideWidth + 'px'
                        }}
                    >
                        <MediaList />
                    </div>
                </div>
                <DragNDropUpload />
            </div>
        )
    }
}