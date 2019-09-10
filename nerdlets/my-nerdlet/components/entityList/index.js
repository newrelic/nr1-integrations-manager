
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Grid, Button, Icon, Popup } from 'semantic-ui-react'
import InstanceModal from './instanceModal'
import ProcessDiscoveryModal from './processDiscoveryModal'

export default class MyNerdlet extends React.Component {

    static propTypes = {
        flexStatusSamples: PropTypes.array.isRequired,
        activeItem: PropTypes.string.isRequired,
        handleState: PropTypes.func.isRequired
    }

    constructor(props){
        super(props)
    }

    createIcons(entity){
        return (
            <div>
                {   entity["flex.ContainerId"] ? 
                    <Popup
                        trigger={<img width="20px" style={{verticalAlign:"sub"}} height="20px" src={"https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-24.png"}/> }
                        content='Container'
                        inverted
                    /> : ""
                }
                {   entity["flex.LambdaName"] ? 
                    <Popup
                        trigger={<img width="20px" style={{verticalAlign:"sub"}} height="20px" src={"https://miro.medium.com/max/1000/1*gcpNI5rPdZn2kE5caUd4Cg.png"}/> }
                        content='Lambda'
                        inverted
                    /> : ""
                }
                {   entity["flex.IsFargate"] ? 
                    <Popup
                        trigger={<img width="20px" style={{verticalAlign:"sub"}} height="20px" src={"https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2018/10/Picture1-7-303x300.png"}/> }
                        content='Fargate'
                        inverted
                    /> : ""
                }
                {   entity["flex.IsKubernetes"] ? 
                    <Popup
                        trigger={<img width="20px" style={{verticalAlign:"sub"}} height="20px" src={"https://upload.wikimedia.org/wikipedia/en/0/00/Kubernetes_%28container_engine%29.png"}/> }
                        content='Kubernetes'
                        inverted
                    /> : ""
                }
                {   !entity["flex.ContainerId"] && !entity["flex.LambdaName"] && (entity["flex.Hostname"]||entity.hostname) ? 
                    <Popup
                        trigger={<img width="20px" style={{verticalAlign:"sub"}} height="20px" src={"https://cdn2.iconfinder.com/data/icons/25-free-ui-icons/40/storage-24.png"}/> }
                        content='Host'
                        inverted
                    /> : ""
                }
            </div>
        )
    }

    renderEntities(entities){
        return entities.map((entity,i)=>{
            let containerId = entity["flex.ContainerId"] ? entity["flex.ContainerId"].slice(0,12) : null
            let name = entity["flex.LambdaName"] || containerId || entity["flex.Hostname"] || entity.hostname || ""
            let gitIcon = entity["flex.GitRepo"] && entity["flex.GitRepo"].includes("github") ? "github" : "git"
            let pathname = ""
            try{
                pathname = new URL(entity["flex.GitRepo"]).pathname.replace("/","")
            }catch(e){
                //
            }

            return (
                <Table.Row key={i}>
                    <Table.Cell>
                        <InstanceModal entity={entity} name={name}/> &nbsp;
                        <ProcessDiscoveryModal entity={entity} name={name} exampleRepoConfigs={this.props.exampleRepoConfigs} handleState={this.props.handleState}/>
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button compact inverted onClick={() => {window.open(`https://rpm.newrelic.com/accounts/${entity.accountId}`, "_blank")}}>
                            {entity.accountId}
                        </Button>
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.createIcons(entity)}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{entity["flex.counter.EventCount"] || entity["flex.EventCount"] || 0}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{entity["flex.counter.EventDropCount"] || entity["flex.EventDropCount"] || 0}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{entity["flex.counter.ConfigsProcessed"] || entity["flex.ConfigsProcessed"] || 0}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{entity["flex.IntegrationVersion"]}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {entity["flex.GitRepo"] ? 
                            <div>
                                <Button.Group>
                                    <Button compact icon labelPosition='left' inverted onClick={() => {window.open(`${entity["flex.GitRepo"]}`, "_blank")}}>
                                        <Icon name={gitIcon}/> {pathname}
                                    </Button> &nbsp;
                                    <Button compact icon labelPosition='left' inverted onClick={() => this.props.handleState("set", {activeItem:"deploy integrations",activeRepo:entity["flex.GitRepo"]})}>
                                        <Icon name="plus"/> Integrations
                                    </Button>
                                </Button.Group>
                            </div> : ""
                        }
                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    render(){
        let entities = this.props.flexStatusSamples.length > 0 ? this.props.flexStatusSamples : []
        return (
            <Grid.Row style={{display:this.props.activeItem == "entities" ? "":"none"}}>
                <Grid.Column>
                    <Table celled inverted selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Entity</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Account</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Type</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Event Count</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Drop Count</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Configs Processed</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Version</Table.HeaderCell>
                                <Table.HeaderCell style={{textAlign:"center"}}>Git Repo</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderEntities(entities)}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        )
    }
}