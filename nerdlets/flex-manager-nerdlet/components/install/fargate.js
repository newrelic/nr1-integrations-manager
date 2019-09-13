
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, List } from 'semantic-ui-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class MyNerdlet extends React.Component {

    static propTypes = {
        activeItem: PropTypes.string.isRequired
    }

    constructor(props){
        super(props)
        this.state = {
            example: "",
            nriFlexConfig: ""
        }
    }

    async componentDidMount(){
        let nriFlexConfig = await fetch('https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/configs/nri-flex-config.yml').then((response)=>response.text())
        if(nriFlexConfig){
            nriFlexConfig = nriFlexConfig.replace("# fargate","fargate")
            this.setState({nriFlexConfig})
        }
        let example = await fetch('https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/examples/cd-nginx.yml').then((response)=>response.text())
        if(example){
            this.setState({example})
        }
    }

    render(){
        let nginxDownloadLink = `https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/examples/cd-nginx.yml`
        return(
            <Grid.Row style={{display:this.props.activeItem == "fargate" ? "":"none"}}>
                <Grid.Column>
                    <Segment inverted>
                        <h3>Deploying on Fargate </h3>
                        <Segment inverted>
                            <List relaxed bulleted>
                                <List.Item>
                                    Build your customized Docker image as in the Docker Install Steps however take into consideration the configs further below.
                                </List.Item>
                                <List.Item>
                                    Once built with your required configs, add your new image as a sidecar to your existing task definition and redeploy.
                                </List.Item>
                                <List.Item>
                                    Note that only IP addresses can be looked up with Fargate Container Discovery, so supply the port yourself if required. <br/>
                                    <a rel="noopener noreferrer" target="_blank" href="https://github.com/newrelic/nri-flex/wiki/Service-Discovery#V2-Container-Discovery">View the documentation for more detail on how the containers are targeted.</a>
                                </List.Item>
                                <List.Item>
                                    For Fargate, ensure the "fargate" parameter is set to true in "nri-flex-config.yml". <br/>
                                    Also set the Insights URL and Insights API Key.
                                    <SyntaxHighlighter language="yaml" style={atomDark}>
                                        {
                                            "### Example nri-flex-config.yml with Fargate mode enabled\n" +
                                            "### Ensure the insights_api_key and insights_url parameters are also configured\n" +
                                            this.state.nriFlexConfig
                                        }
                                    </SyntaxHighlighter>
                                </List.Item>
                                <List.Item>
                                    Example Nginx Config for Container Discovery: <a rel="noopener noreferrer" target="_blank" href={nginxDownloadLink}>cd-nginx.yml</a>
                                    <SyntaxHighlighter language="yaml" style={atomDark}>
                                        {
                                            "### Example Flex Fargate Nginx Config to place into flexConfigs/ folder\n" +
                                            "### FileName: cd-nginx.yml\n" +
                                            this.state.example
                                        }
                                    </SyntaxHighlighter>
                                </List.Item>
                            </List>
                        </Segment>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        )
    }
}