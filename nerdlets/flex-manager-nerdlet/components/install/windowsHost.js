
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, List } from 'semantic-ui-react'

export default class WindowsInstall extends React.Component {

    static propTypes = {
        activeItem: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired
    }

    constructor(props){
        super(props)
    }

    render(){
        let win = `nri-flex-windows-${this.props.version}.tar.gz`
        let downloadPath = `https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/releases/`
        
        return(
            <Grid.Row style={{display:this.props.activeItem == "windows host" ? "":"none"}}>
                <Grid.Column>
                    <Segment inverted>
                        <h3>Windows Install</h3>
                        <List bulleted relaxed>
                            <List.Item>
                                Download the latest windows release <a rel="noopener noreferrer" target="_blank" href={`${downloadPath}${win}`}>{`${downloadPath}${win}`}</a>
                            </List.Item>
                            <List.Item>
                                Unpack
                            </List.Item>
                            <List.Item>
                                Follow included README
                            </List.Item>
                        </List>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        )
    }
}