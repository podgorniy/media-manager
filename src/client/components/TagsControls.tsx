import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {TagLink} from './TagLink'
import {Tagging} from './Tagging'
import {Icon, Label} from 'semantic-ui-react'
import './TagsControls.css'

interface IProps {}

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

    private async _attemptSubmit() {
        const {appState} = this.props
        if (this.state.submissionDisabled) {
            return
        }
        this.setState({
            submissionDisabled: true
        })
        await appState.addTagForSelectedRemotely([this.state.inputValue])
        this.setState({
            inputValue: '',
            submissionDisabled: false
        })
    }

    render() {
        const {appState} = this.props
        return (
            <div>
                <Tagging />
                <div className='TagControls__list'>
                    {appState.selectedItemsTags.map((tag) => {
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
                                        appState.removeTagFromSelectedRemotely(tag)
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
