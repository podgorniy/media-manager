import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'

require('./TagLink.less')

interface IProps {
    tagName: string
}

interface IState {}

@inject('appState')
@observer
export class TagLink extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, tagName} = this.props
        const {router} = appState
        let href
        let currentTagsList = router.queryParams.tags || []
        const isSelected = currentTagsList.indexOf(tagName) !== -1
        if (isSelected) {
            href = router.getFullUrl({
                without: {
                    queryParams: {
                        tags: [tagName]
                    }
                }
            })
        } else {
            href = router.getFullUrl({
                with: {
                    queryParams: {
                        tags: [tagName]
                    }
                }
            })
        }
        return (
            <a
                href={href}
                className={isSelected ? 'remove' : 'with'}
                onClick={(event) => {
                    event.preventDefault()
                    history.replaceState({}, document.title, (event.target as any).href)
                }}
            >
                {tagName}
            </a>
        )
    }
}
