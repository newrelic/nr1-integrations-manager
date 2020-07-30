/* eslint 
no-console: 0,
no-unused-vars: 0,
react/no-unused-state: 0
*/
import React from 'react';
import { Message, Button, Popup, Icon } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import jsyaml from 'js-yaml';
import { AccountStorageMutation } from 'nr1';

import 'brace/mode/yaml';
import 'brace/theme/monokai';

export default class FlexInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      flexConfig: '',
      isDownloading: false,
      isDeploying: false,
      isDeleting: false
    };
  }

  componentDidMount() {
    const { selectedIntegration } = this.props;

    this.setState({ isDownloading: true }, () => {
      fetch(selectedIntegration.url).then((resp) =>
        resp.text().then((flexConfig) => {
          this.setState({ flexConfig, isDownloading: false });
        })
      );
    });
  }

  deployIntegration = (selectedCollection, getCollection) => {
    const { flexConfig } = this.state;
    const { selectedIntegration } = this.props;

    this.setState({ isDeploying: true }, () => {
      AccountStorageMutation.mutate({
        accountId:
          selectedCollection.collectionAccountId ||
          selectedCollection.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: selectedCollection.label,
        documentId: selectedIntegration.name,
        document: {
          config: window.btoa(flexConfig),
          added: Date.now()
        }
      }).then((value) => {
        getCollection(selectedCollection);
        this.setState({ isDeploying: false });
      });
    });
  };

  undeployIntegration = (
    selectedCollection,
    getCollection,
    selectedIntegration
  ) => {
    this.setState({ isDeleting: true }, () => {
      AccountStorageMutation.mutate({
        accountId:
          selectedCollection.collectionAccountId ||
          selectedCollection.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
        collection: selectedCollection.label,
        documentId: selectedIntegration.name
      }).then((value) => {
        getCollection(selectedCollection);
        this.setState({ isDeleting: false });
      });
    });
  };

  render() {
    const { isDeploying, isDeleting, yamlError, flexConfig } = this.state;
    const { selectedIntegration } = this.props;

    return (
      <DataConsumer>
        {({
          selectedAccount,
          selectedCollection,
          collectionData,
          getCollection
        }) => {
          const configExists =
            (collectionData || []).filter(
              (c) => c.id === selectedIntegration.name
            ).length > 0;

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
                                getCollection,
                                selectedIntegration
                              )
                            }
                            labelPosition="left"
                            disabled={
                              !selectedAccount ||
                              !selectedCollection ||
                              yamlError ||
                              configExists
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
                      content="View on GitHub"
                      icon="github"
                      color="green"
                      onClick={() =>
                        window.open(selectedIntegration.html_url, '_blank')
                      }
                      style={{ float: 'right' }}
                    />

                    {configExists ? (
                      <Button
                        animated
                        labelPosition="left"
                        color="instagram"
                        style={{ float: 'right' }}
                        loading={isDeleting}
                        onClick={() =>
                          this.undeployIntegration(
                            selectedCollection,
                            getCollection,
                            selectedIntegration
                          )
                        }
                      >
                        <Button.Content visible>
                          <Icon name="remove circle" /> Remove
                        </Button.Content>
                        <Button.Content hidden>Sure?</Button.Content>
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                )}
              </div>

              <AceEditor
                mode="yaml"
                theme="monokai"
                name="configuration"
                width="100%"
                value={flexConfig}
                onChange={async (v) => {
                  let yamlError = '';
                  try {
                    jsyaml.safeLoad(v);
                  } catch (e) {
                    yamlError = e.message;
                  }
                  this.setState({ flexConfig: v, yamlError });
                }}
                editorProps={{ $blockScrolling: true }}
              />
            </>
          );
        }}
      </DataConsumer>
    );
  }
}
