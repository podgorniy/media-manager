import * as React from 'react'
import {observer} from 'mobx-react'
import {inject} from 'mobx-react'
import {IAppState} from '../app-state'
import {Button} from 'semantic-ui-react'

interface IProps {
    collectionId?: string
    UUIDs?: Array<string>
    count: number
}
interface IState {}

@inject('appState')
@observer
export class DownloadMedia extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState, UUIDs, collectionId, count} = this.props
        return (
            <form target='_blank' action='/api/v1/download' method='post'>
                <input type='hidden' value={collectionId} name='collectionId' />
                {(UUIDs || []).map((uuid) => {
                    return <input type='hidden' value={uuid} name='uuids[]' />
                })}
                <Button size='small' compact>{`Download${!count || count === 1 ? '' : '\u00A0' + count}`}</Button>
            </form>
        )
    }
}
