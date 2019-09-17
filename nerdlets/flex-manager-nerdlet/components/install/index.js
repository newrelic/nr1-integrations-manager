
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Menu } from 'semantic-ui-react'
import LinuxHost from './linuxHost'
import WindowsHost from './windowsHost'
import Docker from './docker'
import K8s from './kubernetes'
import Downloads from './downloads'
import Fargate from './fargate'
import Lambda from './lambda'

export default class Install extends React.Component {

    static propTypes = {
    }

    constructor(props){
        super(props)
        this.state = {
            activeItem: "linux host",
            flexLatestVersion: ""
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    async componentDidMount(){
        let flexLatestVersion = await fetch('https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/releases/LATEST').then((response)=>response.text())
        if(flexLatestVersion){
            this.setState({flexLatestVersion})
        }
    }

    renderMenu(activeItem){
        return (
            <Menu pointing secondary inverted>
                <Menu.Item name='linux host' active={activeItem === 'linux host'} onClick={this.handleItemClick} />
                <Menu.Item name='docker' active={activeItem === 'docker'} onClick={this.handleItemClick} />
                <Menu.Item name='kubernetes' active={activeItem === 'kubernetes'} onClick={this.handleItemClick} />
                <Menu.Item name='fargate' active={activeItem === 'fargate'} onClick={this.handleItemClick} />
                <Menu.Item name='lambda' active={activeItem === 'lambda'} onClick={this.handleItemClick} />
                <Menu.Item name='windows host' active={activeItem === 'windows host'} onClick={this.handleItemClick} />
                <Menu.Item name='downloads' active={activeItem === 'downloads'} onClick={this.handleItemClick} />
            </Menu>
        )
    }

    render(){
        return(
            <Grid.Row style={{display:this.props.activeItem == "install flex" ? "":"none"}}>
                <Grid.Column>
                    {this.renderMenu(this.state.activeItem)}
                    <LinuxHost activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <Docker activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <K8s activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <Fargate activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <Lambda activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <WindowsHost activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                    <Downloads activeItem={this.state.activeItem} version={this.state.flexLatestVersion}/>
                </Grid.Column>
            </Grid.Row>
        )
    }
}