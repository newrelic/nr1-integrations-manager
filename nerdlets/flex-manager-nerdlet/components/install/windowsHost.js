
import React from 'react'
import { Grid, Segment, List } from 'semantic-ui-react'

export default class WindowsInstall extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        let { latest } = this.props

        let filebase = ""
        let filename = ""
        let downloadLink = ""
        let release = []

        if(latest){
            if(latest.assets){
                release = latest.assets.filter((asset)=>asset.name.includes("windows"))
                if(release[0]){
                    downloadLink = release[0].browser_download_url
                    filename = release[0].name
                    filebase = (release[0].name).replace(".tar.gz","")
                }
            }
        }
        
        return(
            <Grid.Row style={{display:this.props.activeItem == "windows host" ? "":"none"}}>
                <Grid.Column>
                    <Segment inverted>
                        <h3>Windows Install</h3>
                        <List bulleted relaxed>
                            <List.Item>
                                Download the latest windows release <a rel="noopener noreferrer" target="_blank" href={downloadLink}>{filename}</a>
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