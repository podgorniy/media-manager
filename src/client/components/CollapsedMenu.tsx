import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IAppState } from '../app-state'
import { Button, Icon } from 'semantic-ui-react'
import './CollapsedMenu.css'

interface IProps {}
interface IState {}

@inject('appState')
@observer
export class CollapsedMenu extends React.Component<IProps & IAppState, IState> {
    constructor(props) {
        super(props)
    }

    render() {
        const {appState} = this.props
        return (
            <div className='CollapsedMenu'>
                <Button.Group icon size='tiny'>
                    <Button
                        compact
                        active={appState.sideExpanded}
                        onClick={() => {
                            appState.toggleSide()
                        }}
                    >
                        <Icon className='ToggleMenu' name='bars' />
                    </Button>
                </Button.Group>
            </div>
        )
    }
}
