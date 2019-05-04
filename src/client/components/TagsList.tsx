import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {IAppState} from '../app-state'
import {fetchTags} from '../api'
import {TagLink} from './TagLink'
import {RouterLink} from './RouterLink'

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
        const anyTagsSelected = appState.router.queryParams.tags && appState.router.queryParams.tags.length
        const urlWithoutTags = appState.router.getFullUrl({replace: {queryParams: {tags: []}}})
        return (
            <div>
                <h4>
                    Теги {anyTagsSelected ? <RouterLink url={urlWithoutTags}>не выделить ни одного</RouterLink> : null}
                </h4>
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
