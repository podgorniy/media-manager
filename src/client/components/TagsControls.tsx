import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {TagLink} from './TagLink'
import {Tagging} from './Tagging'
import {Icon, Label} from 'semantic-ui-react'
import './TagsControls.css'
import {UUID} from '../../common/interfaces'
import {getTagsForMedia} from '../lib'

interface IProps {
    mediaUUIDs: Array<UUID>
}

interface IState {
    inputValue: string
    submissionDisabled: boolean
}

@inject('appState')
@observer
export class TagsControls extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: '',
            submissionDisabled: false
        }
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <Tagging mediaUUIDs={this.props.mediaUUIDs} />
                <div className='TagControls__list'>
                    {getTagsForMedia(appState, this.props.mediaUUIDs).map((tag) => {
                        let href
                        const {router} = appState
                        let currentTagsList = router.queryParams.tags || []
                        const isSelected = currentTagsList.indexOf(tag) !== -1
                        if (isSelected) {
                            href = router.getFullUrl({
                                without: {
                                    queryParams: {
                                        tags: [tag]
                                    }
                                }
                            })
                        } else {
                            href = router.getFullUrl({
                                with: {
                                    queryParams: {
                                        tags: [tag]
                                    }
                                }
                            })
                        }
                        return (
                            <Label key={href} size='small' color={isSelected ? 'black' : 'grey'}>
                                <TagLink href={href}>{tag}</TagLink>
                                <Icon
                                    onClick={(event) => {
                                        event.preventDefault()
                                        appState.removeTagFrom(tag, this.props.mediaUUIDs)
                                    }}
                                    name='delete'
                                />
                            </Label>
                        )
                    })}
                </div>
            </div>
        )
    }
}
