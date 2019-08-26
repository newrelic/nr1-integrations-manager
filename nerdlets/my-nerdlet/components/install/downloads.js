
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, List } from 'semantic-ui-react'

export default class MyNerdlet extends React.Component {

    static propTypes = {
        activeItem: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired
    }

    constructor(props){
        super(props)
    }

    render(){
        let linux = `nri-flex-linux-${this.props.version}.tar.gz`
        let darwin = `nri-flex-darwin-${this.props.version}.tar.gz`
        let win = `nri-flex-windows-${this.props.version}.tar.gz`
        let downloadPath = `https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/releases/`
        
        return(
            <Grid.Row style={{display:this.props.activeItem == "downloads" ? "":"none"}}>
                <Grid.Column>
                    <Segment inverted>
                        <List bulleted relaxed>
                            <List.Item>
                                Linux: <a rel="noopener noreferrer" target="_blank" href={`${downloadPath}${linux}`}>{`${downloadPath}${linux}`}</a>
                            </List.Item>
                            <List.Item>
                                Mac: <a rel="noopener noreferrer" target="_blank" href={`${downloadPath}${darwin}`}>{`${downloadPath}${darwin}`}</a>
                            </List.Item>
                            <List.Item>
                                Windows: <a rel="noopener noreferrer" target="_blank" href={`${downloadPath}${win}`}>{`${downloadPath}${win}`}</a>
                            </List.Item>
                        </List>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        )
    }
}