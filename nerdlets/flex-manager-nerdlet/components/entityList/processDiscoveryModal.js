
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Icon } from 'semantic-ui-react'

export default class ProcessDiscoveryModal extends React.Component {

    static propTypes = {
        entity: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        handleState: PropTypes.func.isRequired
    }

    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }
    
    close = () => this.setState({ open: false })

    render(){
        let processes = []
        Object.keys(this.props.entity).forEach((attr)=>{
            if(attr.includes("flex.pd.")){
                try{
                    let jsonData = JSON.parse(this.props.entity[attr])
                    processes.push(jsonData)
                }catch(e){

                }
            }
        })
        const { open, closeOnEscape, closeOnDimmerClick } = this.state
        return ( 
                 processes.length > 0 ? 
                    <Modal 
                        open={open} 
                        closeOnEscape={closeOnEscape}
                        closeOnDimmerClick={closeOnDimmerClick}
                        onClose={this.close}
                        size="large" style={{backgroundColor:"#000e0e"}} 
                        trigger={<Button inverted onClick={()=>{this.setState({open:true})}}> <Icon name='searchengin' /> Discover </Button>}
                        onActionClick={(e,d)=>{console.log(e,d)}}
                        >
                        <Modal.Header>{this.props.name}</Modal.Header>
                            <Modal.Content style={{backgroundColor:"#000e0e"}}>
                            <Table celled inverted>
                                <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Command</Table.HeaderCell>
                                    <Table.HeaderCell>Local</Table.HeaderCell>
                                    <Table.HeaderCell>Remote</Table.HeaderCell>
                                    <Table.HeaderCell>Integrations</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {processes.map((process, i)=>{
                                        let searchWords = (process.name + " " + process.cmd).replace(/[^a-zA-Z ]/g, "").replace(/-/g, ' ').replace(/_/g, ' ').split(" ")
                                        let resultMatches = []
                                        searchWords.forEach((word)=>{
                                            this.props.exampleRepoConfigs.forEach((cfg)=>{
                                                let cfgSearchWords = cfg.name.replace("example","").replace(".tmpl","").replace("old","").replace(".yml","").replace(".yaml","").replace("_","-").split("-").filter(Boolean)
                                                cfgSearchWords.forEach((word2)=>{
                                                    if(word.toLowerCase().includes(word2.toLowerCase()) && !word.includes("newrelic")){
                                                        resultMatches.push(cfg)
                                                    }
                                                })
                                            })
                                        })
                                        resultMatches = [...new Set(resultMatches)];  // new Set makes the array unique
                                        return(
                                            <Table.Row key={i}>
                                                <Table.Cell>{process.name}</Table.Cell>
                                                <Table.Cell>{process.cmd}</Table.Cell>
                                                <Table.Cell>{process.localIP} {process.localPort}</Table.Cell>
                                                <Table.Cell>{process.remoteIP} {process.remotePort}</Table.Cell>
                                                <Table.Cell>{resultMatches.map((cfg, i)=>{
                                                    return (
                                                        <div style={{paddingBottom:"2px"}} key={i}>
                                                                <Button icon inverted labelPosition='left' size="mini" onClick={async ()=>{
                                                                    let header = `### Network Discovery\n`
                                                                    let networkInfoLocal = `### local ${process.localIP} ${process.localPort}\n`
                                                                    let networkInfoRemote = `### remote ${process.remoteIP} ${process.remotePort}\n`
                                                                    let tempConfig = await fetch(cfg.download_url).then((response)=>response.text())
                                                                    this.props.handleState("set",{
                                                                                                activeItem: "deploy integrations",
                                                                                                configFileName: cfg.name,
                                                                                                tempConfig: header + networkInfoLocal + networkInfoRemote + tempConfig
                                                                                            })
                                                                    this.setState({open:false})
                                                                }}>
                                                                <Icon name='plus' />{cfg.name.replace(".yml","").replace(".yaml","")}
                                                            </Button>
                                                        </div>
                                                    )
                                                })}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                        </Modal.Content>
                    </Modal>
                : "" 
            
        )
    }
}