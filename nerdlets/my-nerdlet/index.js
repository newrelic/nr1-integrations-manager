import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Grid } from 'semantic-ui-react'
import { NerdGraphQuery } from 'nr1';
import Header from './components/header'
import FlexEntityList from './components/entityList/index'
import FlexRepoList from './components/repositoryList/index'
import FlexDeployIntegrations from './components/deployIntegrations/index'
import InstallFlex from './components/install/index'

import gql from 'graphql-tag';
const q = require('./queries')

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        nr1: PropTypes.object
    };

    constructor(props){
        super(props)
        this.state = {
            enableRefresh: false,
            activeItem: "entities",
            enableNerdLog: true,
            accounts: [],
            flexEntities: [],
            flexGitRepos: {},
            flexSummarySamples: [],
            flexStatusSamples: [],
            configFileName: "",
            tempConfig: "",
            activeRepo: "",
            loading: false,
            configSearchLoading: false,
            configSearchResults: [],
            value: "",
            branch:"master",
            customRepoLinks: [],
            exampleRepoLinks:   [ 
                            "https://api.github.com/repos/kav91/nri-flex-concept/contents/flexConfigs",
                            "https://api.github.com/repos/kav91/nri-flex-concept/contents/flexContainerDiscovery"
            ],
            exampleRepoConfigs: []
        }
        this.handleState = this.handleState.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.fetchFlexSummarySamples = this.fetchFlexSummarySamples.bind(this)
        this.fetchFlexStatusSamples = this.fetchFlexStatusSamples.bind(this)
        this.fetchRepoExamples = this.fetchRepoExamples.bind(this)
    }

    nerdLog(msg){
        if(this.state.enableNerdLog){ console.log(msg) }
    }

    handleState(type, data){
        switch(type) {
            case "set":
                this.setState(data)
                break;
            case "get":
                return this.state[data]
            default:
              this.nerdLog(`handleState unknown ${type}`)
          }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    componentDidMount(){
        this.fetchData()
        this.refresh = setInterval(()=>{
            if(this.state.enableRefresh){
                this.fetchData()
            }
        },15000);
    }

    async fetchData(){
        if(this.state.loading == false){
            this.setState({"loading":true})
            this.fetchRepoExamples(this.state.exampleRepoLinks)
            let accountResults  = await NerdGraphQuery.query({ query: gql(q.getAccounts()) })
            const accounts = (((accountResults || {}).data || {}).actor || {}).accounts || []
            this.setState({"accounts": accounts})
            await this.fetchFlexSummarySamples(accounts)
            this.setState({"loading":false})
        }
    }

    fetchFlexSummarySamples(accounts){
        return new Promise((resolve)=>{
            let summaryPromises = accounts.map((account)=>NerdGraphQuery.query({ query: gql(q.nrql(account.id, q.nrqlFlexSummary)) }))
            Promise.all(summaryPromises).then(async(values)=>{
                let flexSummarySamples = []
                let flexGitRepos = {}

                values.forEach((value)=>{
                    let results = (((((value || {}).data || {}).actor || {}).account || {}).nrql || {}).results || []
                    let accountId = ((((value || {}).data || {}).actor || {}).account || {}).id || null
                    let accountName = ((((value || {}).data || {}).actor || {}).account || {}).name || null
                    results.forEach((result)=>{
                        result["accountId"] = accountId
                        result["accountName"] = accountName
                        result["flex.ContainerId"] = result.facet[0]
                        result["flex.Hostname"] = result.facet[1]
                        result["flex.LambdaName"] = result.facet[2]
                        result["entityGuid"] = result.facet[3]
                        result["flex.GitRepo"] = result.facet[4]       
                        if(result["flex.GitRepo"] && !flexGitRepos[result["flex.GitRepo"]]){
                            flexGitRepos[result["flex.GitRepo"]] = []
                        }
                        let name = result["flex.LambdaName"] || result["flex.ContainerId"] || result["flex.Hostname"] || result.hostname || ""

                        if(result["flex.GitRepo"] && !flexGitRepos[result["flex.GitRepo"]].includes(name.toLowerCase())){
                            flexGitRepos[result["flex.GitRepo"]].push(name.toLowerCase())
                        }
                        flexSummarySamples.push(result)
                    })
                })
                this.setState({flexSummarySamples,flexGitRepos})
                await this.fetchFlexStatusSamples(flexSummarySamples)
                resolve()
            })
        });
    }

    fetchFlexStatusSamples(summarySamples){
        return new Promise((resolve)=>{
            let queries = []
            let statusSamplePromise = []
            summarySamples.forEach((sample)=>{
                let query = ""
                if(sample["flex.LambdaName"]){
                    query = `FROM flexStatusSample SELECT * WHERE flex.LambdaName = '${sample["flex.LambdaName"]}' SINCE 1 minute ago LIMIT 1`
                }else if(sample["flex.ContainerId"]){
                    query = `FROM flexStatusSample SELECT * WHERE flex.ContainerId = '${sample["flex.ContainerId"]}' SINCE 1 minute ago LIMIT 1`
                }else if(sample["entityGuid"]){
                    query = `FROM flexStatusSample SELECT * WHERE entityGuid = '${sample["entityGuid"]}' SINCE 1 minute ago LIMIT 1`
                }else if(sample["flex.Hostname"]){
                    query = `FROM flexStatusSample SELECT * WHERE flex.Hostname = '${sample["flex.Hostname"]}' SINCE 1 minute ago LIMIT 1`
                }
                if(query && !queries.includes(query)){
                    statusSamplePromise.push(NerdGraphQuery.query({ query: gql(q.nrql(sample.accountId, query)) }))
                    queries.push(query)
                }
            })

            Promise.all(statusSamplePromise).then((values)=>{
                let flexStatusSamples = []
                values.forEach((value)=>{
                    let result = (((((value || {}).data || {}).actor || {}).account || {}).nrql || {}).results[0] || null
                    if(result){
                        let accountId = ((((value || {}).data || {}).actor || {}).account || {}).id || null
                        let accountName = ((((value || {}).data || {}).actor || {}).account || {}).name || null
                        result.accountId = accountId
                        result.accountName = accountName
                        flexStatusSamples.push(result)
                    }
                })
                this.setState({flexStatusSamples})
                resolve()
            })
        });
    }

    fetchRepoExamples(links){
        let repoPromises = links.map((link)=>fetch(link).then((response)=>response.json()))
        Promise.all(repoPromises).then((values)=>{
            let exampleRepoConfigsTemp = []
            values.forEach((value)=>{ exampleRepoConfigsTemp = exampleRepoConfigsTemp.concat(value) })
            let exampleRepoConfigs = exampleRepoConfigsTemp.map((val)=>{
                val.title = val.name // used so search doesn't complain
                return val
            })
            this.setState({exampleRepoConfigs})
        });
    }
    
    renderMenu(activeItem){
        return(
            <Menu pointing secondary inverted>
                {/* // position='right' */}
                <Menu.Item name='install flex' active={activeItem === 'install flex'} onClick={this.handleItemClick} />
                <Menu.Item name='entities' active={activeItem === 'entities'} onClick={this.handleItemClick} />
                <Menu.Item name='repositories' active={activeItem === 'repositories'} onClick={this.handleItemClick} />
                <Menu.Item name='deploy integrations' active={activeItem === 'deploy integrations'} onClick={this.handleItemClick} />
            </Menu>
        )
    }

    render() {
        return (
            <div style={{backgroundColor:"#000e0e", height:"100%"}}>
                <div style={{backgroundColor:"#000e0e"}}>
                    <Header flexStatusSamples={this.state.flexStatusSamples} flexGitRepos={this.state.flexGitRepos} fetchData={this.fetchData} loading={this.state.loading} noAccounts={this.state.accounts.length} handleState={this.handleState} enableRefresh={this.state.enableRefresh}/>
                    {this.renderMenu(this.state.activeItem)}
                    <Grid inverted style={{paddingTop:"5px",paddingLeft:"5px",paddingRight:"5px", height:"100%", backgroundColor:"#000e0e"}}>
                        <InstallFlex handleState={this.handleState} activeItem={this.state.activeItem} />
                        <FlexEntityList handleState={this.handleState} activeItem={this.state.activeItem} flexStatusSamples={this.state.flexStatusSamples} exampleRepoConfigs={this.state.exampleRepoConfigs} />
                        <FlexRepoList handleState={this.handleState} activeItem={this.state.activeItem} flexGitRepos={this.state.flexGitRepos} activeRepo={this.state.activeRepo} />
                        <FlexDeployIntegrations handleState={this.handleState} activeItem={this.state.activeItem} exampleRepoConfigs={this.state.exampleRepoConfigs} />
                    </Grid>
                </div>
            </div>
        )
    }
}
