import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {fetchTags} from '../api'
import {TagLink} from './TagLink'

@inject('appState')
@observer
export class TagsList extends React.Component<{} & IAppState, {}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {appState} = this.props
        fetchTags()
            .then((res) => {
                appState.setTags(res.tags)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    render() {
        const {appState} = this.props

        return (
            <div>
                <h4>Теги</h4>
                <ul>
                    {appState.tags.map(({name}) => {
                        return (
                            <li key={name}>
                                <TagLink tagName={name} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
