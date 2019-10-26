import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { TagLink } from './TagLink'
import { Button, Label } from 'semantic-ui-react'
import './TagsList.less'

@inject('appState')
@observer
export class TagsList extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.appState.refreshTags()
    }

    render() {
        const {appState} = this.props
        const anyTagsSelected = appState.router.queryParams.tags && appState.router.queryParams.tags.length
        const urlWithoutTags = appState.router.getFullUrl({replace: {queryParams: {tags: []}}})
        return (
            <div>
                {anyTagsSelected ? (
                    <Button
                        className='TagsList'
                        size='tiny'
                        onClick={() => {
                            appState.router.replaceUrl(urlWithoutTags)
                        }}
                    >
                        Deselect all tags
                    </Button>
                ) : null}
                <div>
                    {appState.tags.map(({name}) => {
                        let href
                        const {router} = appState
                        let currentTagsList = router.queryParams.tags || []
                        const isSelected = currentTagsList.indexOf(name) !== -1
                        if (isSelected) {
                            href = router.getFullUrl({
                                without: {
                                    queryParams: {
                                        tags: [name]
                                    }
                                }
                            })
                        } else {
                            href = router.getFullUrl({
                                with: {
                                    queryParams: {
                                        tags: [name]
                                    }
                                }
                            })
                        }
                        return (
                            <Label
                                className='TagsList__item'
                                color={isSelected ? 'black' : 'grey'}
                                size='small'
                                key={name}
                            >
                                <TagLink href={href}>{name}</TagLink>
                                {/*<Icon name='delete' />*/}
                            </Label>
                        )
                    })}
                </div>
            </div>
        )
    }
}
