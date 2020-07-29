/* eslint 
no-console: 0
*/
import React from 'react';
import { Message, Menu, Button, Popup } from 'semantic-ui-react';
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
    .replace('.sample', '')
    .replace('.yml', '')
    .replace('.yaml', '');
};

export default class IntegrationInfo extends React.PureComponent {
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
      isDeploying: false,
      isDeleting: false
    };
  }

  componentDidMount() {
    const { selectedIntegration, pkgName, integrationType } = this.props;
    if (selectedIntegration) {
      let standardUrl = selectedIntegration.standard;
      let discoveryUrl = selectedIntegration.discovery || null;

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

      if (integrationType === 'product') {
        // get readme
        fetch(`${rawGithubUrl}${repo}/master/README.md`).then((response) =>
          response.text().then((data) => this.setState({ readme: data }))
        );
      }
    }
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  deployIntegration = (selectedCollection, getCollection) => {
    const {
      activeItem,
      standardConfig,
      standardConfigName,
      discConfig,
      discConfigName
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

  render() {
    const {
      isDeploying,
      isDeleting,
      activeItem,
      standardConfigName,
      standardConfig,
      discConfigName,
      discConfig,
      readme,
      yamlError
    } = this.state;
    const { integrationType } = this.props;

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
                />
                {discConfig ? (
                  <Menu.Item
                    name="Discovery Configuration"
                    active={activeItem === 'Discovery Configuration'}
                    onClick={this.handleItemClick}
                  />
                ) : (
                  ''
                )}
                {integrationType === 'product' ? (
                  <Menu.Item
                    name="README"
                    active={activeItem === 'README'}
                    onClick={this.handleItemClick}
                  />
                ) : (
                  ''
                )}
              </Menu>
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
                      {configExists ? (
                        <Button
                          icon="remove circle"
                          content={'Remove'}
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
                    this.setState({ standardConfig: v, yamlError });
                  }}
                  editorProps={{ $blockScrolling: true }}
                />{' '}
              </div>

              {activeItem === 'README' ? (
                <ReactMarkdown
                  source={readme.split('\n').slice(1).join('\n')}
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
