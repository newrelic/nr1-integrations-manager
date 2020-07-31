/* eslint 
no-console: 0,
no-unused-vars: 0
*/
import React from 'react';
import {
  Message,
  Menu,
  Button,
  Popup,
  Accordion,
  Table,
  Icon
} from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';
import jsyaml from 'js-yaml';
import { AccountStorageMutation } from 'nr1';

import 'brace/mode/yaml';
import 'brace/theme/monokai';

const getFileName = (url) => {
  return url
    .split('/')
    .pop()
    .replace('.yml.k8s_sample', '-k8s')
    .replace('.yaml.k8s_sample', '-k8s')
    .replace('.sample', '')
    .replace('.yml', '')
    .replace('.yaml', '');
};

const cleanK8sConfig = (cfg) => {
  try {
    cfg = cfg.split('\n').slice(1);
    let spaceCheckLine = 0;
    for (let z = 0; z < cfg.length; z++) {
      if (cfg[z] === '---' || cfg[z] === ' discovery:') {
        spaceCheckLine = z;
        break;
      }
    }

    let spaceCounter = 0;
    for (let z = 0; z, cfg[spaceCheckLine].length; z++) {
      if (cfg[spaceCheckLine][z] === ' ') {
        spaceCounter++;
      } else {
        break;
      }
    }

    cfg.forEach((c, i) => {
      cfg[i] = c.slice(spaceCounter, c.length);
    });

    return cfg.join('\n');
  } catch (e) {
    return 'failed to parse';
  }
};

export default class ProductIntegrationInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'Configuration',
      standardConfig: '',
      standardConfigName: '',
      discConfig: '',
      discConfigName: '',
      k8sConfig: '',
      k8sConfigName: '',
      readme: '',
      changelog: '',
      isDeploying: false,
      isDeleting: false,
      activeIndex: null
    };
  }

  componentDidMount() {
    const { selectedIntegration, pkgName, integrationType } = this.props;

    if (selectedIntegration && integrationType === 'product') {
      let standardUrl = selectedIntegration.standard;
      let discoveryUrl = selectedIntegration.discovery || null;
      let k8s = selectedIntegration.k8s || null;

      const rawGithubUrl = 'https://raw.githubusercontent.com/newrelic/';
      const repo = selectedIntegration.git.replace(
        'https://github.com/newrelic/',
        ''
      );

      if (!standardUrl.startsWith('http')) {
        standardUrl = `${rawGithubUrl}${pkgName}${standardUrl}`;
      }

      if (discoveryUrl && !discoveryUrl.startsWith('http')) {
        discoveryUrl = `${rawGithubUrl}${pkgName}${discoveryUrl}`;
      }

      if (discoveryUrl && !discoveryUrl.startsWith('http')) {
        k8s = `${rawGithubUrl}${pkgName}${k8s}`;
      }

      // get standard config
      fetch(standardUrl).then((response) =>
        response.text().then((data) =>
          this.setState({
            standardConfig: data,
            standardConfigName: getFileName(standardUrl)
          })
        )
      );

      if (discoveryUrl) {
        // get discovery config
        fetch(discoveryUrl).then((response) =>
          response.text().then((data) =>
            this.setState({
              discConfig: data,
              discConfigName: getFileName(discoveryUrl)
            })
          )
        );
      }

      if (k8s) {
        // get discovery config
        fetch(k8s).then((response) =>
          response.text().then((data) =>
            this.setState({
              k8sConfig: cleanK8sConfig(data),
              k8sConfigName: getFileName(k8s)
            })
          )
        );
      }

      if (integrationType === 'product') {
        // get readme
        fetch(`${rawGithubUrl}${repo}/master/README.md`).then((response) =>
          response.text().then((data) => this.setState({ readme: data }))
        );
        // get readme
        fetch(`${rawGithubUrl}${repo}/master/CHANGELOG.md`).then((response) =>
          response.text().then((data) => this.setState({ changelog: data }))
        );
      }
    }
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  deployIntegration = (selectedCollection, getCollection) => {
    const {
      activeItem,
      standardConfig,
      standardConfigName,
      discConfig,
      discConfigName,
      k8sConfig,
      k8sConfigName
    } = this.state;
    this.setState({ isDeploying: true }, () => {
      let config = '';
      let documentId = '';
      if (activeItem === 'Configuration') {
        config = standardConfig;
        documentId = standardConfigName;
      } else if (activeItem === 'Discovery Configuration') {
        config = discConfig;
        documentId = discConfigName;
      } else if (activeItem === 'Kubernetes Configuration') {
        config = k8sConfig;
        documentId = k8sConfigName;
      }

      AccountStorageMutation.mutate({
        accountId:
          selectedCollection.collectionAccountId ||
          selectedCollection.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: selectedCollection.label,
        documentId,
        document: {
          config: window.btoa(config),
          added: Date.now()
        }
      }).then((value) => {
        getCollection(selectedCollection);
        this.setState({ isDeploying: false });
      });
    });
  };

  undeployIntegration = (selectedCollection, getCollection) => {
    const { activeItem, standardConfigName, discConfigName } = this.state;
    this.setState({ isDeleting: true }, () => {
      let documentId = '';
      if (activeItem === 'Configuration') {
        documentId = standardConfigName;
      } else if (activeItem === 'Discovery Configuration') {
        documentId = discConfigName;
      }

      AccountStorageMutation.mutate({
        accountId:
          selectedCollection.collectionAccountId ||
          selectedCollection.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
        collection: selectedCollection.label,
        documentId
      }).then((value) => {
        getCollection(selectedCollection);
        this.setState({ isDeleting: false });
      });
    });
  };

  renderAccordion = (discOptions) => {
    return (
      <Accordion style={{ paddingBottom: '10px' }}>
        <Accordion.Title
          style={{ display: discOptions ? '' : 'none' }}
          active={this.state.activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          View Discovery Options
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 0}>
          <Table
            celled
            basic="very"
            style={{ width: '500px', paddingLeft: '20px' }}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Variable</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{`$\{discovery.ip}`}</Table.Cell>
                <Table.Cell>Container public IP address, if any</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.private.ip}`}</Table.Cell>
                <Table.Cell>Container private IP address</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.port}`}</Table.Cell>
                <Table.Cell>Container public port</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.private.port}`}</Table.Cell>
                <Table.Cell>Container private port</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.image}`}</Table.Cell>
                <Table.Cell>Image name</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.name}`}</Table.Cell>
                <Table.Cell>Container name</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{`$\{discovery.label.<label name>}`}</Table.Cell>
                <Table.Cell>
                  Any container label, accessible by its name
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    );
  };

  render() {
    const {
      isDeploying,
      isDeleting,
      activeItem,
      standardConfigName,
      standardConfig,
      discConfigName,
      discConfig,
      k8sConfig,
      k8sConfigName,
      readme,
      changelog,
      yamlError
    } = this.state;
    const { integrationType, selectedIntegration } = this.props;

    return (
      <DataConsumer>
        {({
          selectedAccount,
          selectedCollection,
          collectionData,
          getCollection
        }) => {
          let configName = '';
          if (activeItem === 'Configuration') {
            configName = standardConfigName;
          } else if (activeItem === 'Discovery Configuration') {
            configName = discConfigName;
          } else if (activeItem === 'Kubernetes Configuration') {
            configName = k8sConfigName;
          }

          const configExists =
            (collectionData || []).filter((c) => c.id === configName).length > 0
              ? true
              : false;

          let deployMsg = '';

          if (configExists) {
            deployMsg = 'Integration already exists in this collection.';
          } else {
            if (!selectedAccount) {
              deployMsg = 'Select an account';
            }

            if (!selectedCollection) {
              deployMsg = deployMsg
                ? `${deployMsg} and collection`
                : 'Select a collection';
            }

            if (!deployMsg) {
              deployMsg = `Deploy to: ${selectedAccount.label} - ${selectedCollection.label}`;
            }
          }

          return (
            <>
              <Menu pointing secondary>
                <Menu.Item
                  name="Configuration"
                  active={activeItem === 'Configuration'}
                  onClick={this.handleItemClick}
                  icon="file code outline"
                />
                {discConfig ? (
                  <Menu.Item
                    name="Discovery Configuration"
                    active={activeItem === 'Discovery Configuration'}
                    onClick={this.handleItemClick}
                    icon="docker"
                  />
                ) : (
                  ''
                )}
                {k8sConfig ? (
                  <Menu.Item
                    name="Kubernetes Configuration"
                    active={activeItem === 'Kubernetes Configuration'}
                    onClick={this.handleItemClick}
                    icon="docker"
                  />
                ) : (
                  ''
                )}
                {integrationType === 'product' ? (
                  <Menu.Item
                    name="README"
                    active={activeItem === 'README'}
                    onClick={this.handleItemClick}
                    icon="book"
                  />
                ) : (
                  ''
                )}
                {integrationType === 'product' ? (
                  <Menu.Item
                    name="CHANGELOG"
                    active={activeItem === 'CHANGELOG'}
                    onClick={this.handleItemClick}
                    icon="tasks"
                  />
                ) : (
                  ''
                )}
              </Menu>

              {selectedIntegration &&
              selectedIntegration.requirements &&
              selectedIntegration.requirements.length > 0 ? (
                <div style={{ paddingBottom: '10px' }}>
                  <Message warning>
                    <Message.Header>Requirements</Message.Header>
                    <Message.List>
                      {selectedIntegration.requirements.map((r, i) => {
                        if (r.includes(':::')) {
                          const rSplit = r.split(':::');
                          return (
                            <Message.Item
                              key={i}
                              style={{
                                cursor: 'pointer',
                                color: 'blue'
                              }}
                              onClick={() => window.open(rSplit[1], '_blank')}
                            >
                              {rSplit[0]}
                            </Message.Item>
                          );
                        }
                        return <Message.Item key={i}>{r}</Message.Item>;
                      })}
                    </Message.List>
                  </Message>
                </div>
              ) : (
                ''
              )}

              {activeItem.includes('Configuration') ? (
                <div style={{ paddingBottom: '10px' }}>
                  {yamlError ? (
                    <Message negative>
                      <Message.Header>Invalid YAML</Message.Header>
                      <p>{yamlError}</p>
                    </Message>
                  ) : (
                    <div style={{ paddingBottom: '35px' }}>
                      <Popup
                        content={deployMsg}
                        position="bottom left"
                        trigger={
                          <div style={{ float: 'left' }}>
                            <Button
                              content={configExists ? 'Deployed' : 'Deploy'}
                              color="green"
                              loading={isDeploying}
                              icon={configExists ? 'check' : 'rocket'}
                              onClick={() =>
                                this.deployIntegration(
                                  selectedCollection,
                                  getCollection
                                )
                              }
                              labelPosition="left"
                              disabled={
                                !selectedAccount ||
                                !selectedCollection ||
                                yamlError ||
                                configExists
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        }
                      />

                      <Button
                        positive={!yamlError ? true : false}
                        negative={yamlError ? true : false}
                        content={yamlError ? `Invalid YAML` : 'Valid YAML'}
                        icon={yamlError ? 'close' : 'check'}
                        style={{ cursor: 'none', float: 'right' }}
                      />
                      <Button
                        content="Container Discovery"
                        color="blue"
                        icon="docker"
                        style={{ float: 'right' }}
                        onClick={() =>
                          window.open(
                            'https://docs.newrelic.com/docs/integrations/host-integrations/installation/container-auto-discovery#define-discover',
                            '_blank'
                          )
                        }
                      />
                      {configExists ? (
                        <Button
                          icon="remove circle"
                          content="Remove"
                          labelPosition="left"
                          color="instagram"
                          style={{ float: 'right' }}
                          loading={isDeleting}
                          onClick={() =>
                            this.undeployIntegration(
                              selectedCollection,
                              getCollection
                            )
                          }
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                </div>
              ) : (
                ''
              )}
              <div
                style={{
                  display: activeItem === 'Configuration' ? '' : 'none'
                }}
              >
                <AceEditor
                  mode="yaml"
                  theme="monokai"
                  name="configuration"
                  width="100%"
                  value={standardConfig}
                  onChange={async (v) => {
                    let yamlError = '';
                    try {
                      jsyaml.safeLoad(v);
                    } catch (e) {
                      yamlError = e.message;
                    }
                    this.setState({ standardConfig: v, yamlError });
                  }}
                  editorProps={{ $blockScrolling: true }}
                />
              </div>

              <div
                style={{
                  display:
                    activeItem === 'Discovery Configuration' && discConfig
                      ? ''
                      : 'none'
                }}
              >
                {this.renderAccordion(true)}
                <AceEditor
                  mode="yaml"
                  theme="monokai"
                  name="configuration"
                  width="100%"
                  value={discConfig}
                  onChange={async (v) => {
                    let yamlError = '';
                    try {
                      jsyaml.safeLoad(v);
                    } catch (e) {
                      yamlError = e.message;
                    }
                    this.setState({ discConfig: v, yamlError });
                  }}
                  editorProps={{ $blockScrolling: true }}
                />
              </div>

              <div
                style={{
                  display:
                    activeItem === 'Kubernetes Configuration' && k8sConfig
                      ? ''
                      : 'none'
                }}
              >
                {this.renderAccordion(true)}
                <AceEditor
                  mode="yaml"
                  theme="monokai"
                  name="configuration"
                  width="100%"
                  value={k8sConfig}
                  onChange={async (v) => {
                    let yamlError = '';
                    try {
                      jsyaml.safeLoad(v);
                    } catch (e) {
                      yamlError = e.message;
                    }
                    this.setState({ k8sConfig: v, yamlError });
                  }}
                  editorProps={{ $blockScrolling: true }}
                />
              </div>

              {activeItem === 'README' ? (
                <ReactMarkdown
                  source={readme.split('\n').slice(1).join('\n')}
                  escapeHtml={false}
                />
              ) : (
                ''
              )}
              {activeItem === 'CHANGELOG' ? (
                <ReactMarkdown
                  source={changelog.split('\n').slice(1).join('\n')}
                  escapeHtml={false}
                />
              ) : (
                ''
              )}
            </>
          );
        }}
      </DataConsumer>
    );
  }
}
