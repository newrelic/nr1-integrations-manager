import React from 'react';
import { Modal, Button, Popup, Icon, Input } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { NerdGraphMutation, ngql } from 'nr1';
import { createApiKeyQuery } from '../../context/queries';

export default class AddKey extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { createOpen: false, name: '', isAdding: false };
  }

  handleOpen = () => this.setState({ createOpen: true, name: '' });
  handleClose = () => this.setState({ createOpen: false, name: '' });

  addKey = (selectedAccount, userData, updateDataStateContext) => {
    return new Promise((resolve) => {
      this.setState({ isAdding: true }, () => {
        const { name } = this.state;
        // add key
        NerdGraphMutation.mutate({
          mutation: ngql`
            ${createApiKeyQuery(selectedAccount.key, name, userData.id)}
          `
        }).then((value) => {
          this.setState({ isAdding: false, createOpen: false }, () => {
            const keyData =
              ((((value || {}).data || {}).apiAccessCreateKeys || {})
                .createdKeys || {})[0] || null;

            if (keyData) {
              updateDataStateContext({
                selectedApiKey: {
                  key: keyData.id,
                  value: keyData.key,
                  label: `${name} - ${keyData.key.slice(0, 8)}...`,
                  text: `${name} - ${keyData.key.slice(0, 8)}...`
                }
              });
            }

            resolve(value);
          });
        });
      });
    });
  };

  render() {
    const { createOpen, isAdding, name } = this.state;
    return (
      <DataConsumer>
        {({
          selectedAccount,
          userData,
          getApiKeys,
          updateDataStateContext
        }) => {
          return (
            <Modal
              closeIcon
              onClose={this.handleClose}
              open={createOpen}
              size="tiny"
              trigger={
                <Popup
                  content="Create API Key"
                  trigger={
                    <Button
                      onClick={this.handleOpen}
                      style={{ height: '45px' }}
                      className="filter-button"
                    >
                      <Icon.Group
                        size="large"
                        style={{
                          marginTop: '5px',
                          marginLeft: '8px',
                          marginRight: '-10px'
                        }}
                      >
                        <Icon name="key" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>Create API Key</Modal.Header>
              <Modal.Content>
                <Input
                  style={{ width: '100%' }}
                  placeholder="API Key name..."
                  value={name}
                  onChange={(e, d) => this.setState({ name: d.value })}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button
                  style={{ float: 'left' }}
                  negative
                  onClick={this.handleClose}
                >
                  Close
                </Button>

                <Button
                  positive
                  loading={isAdding}
                  onClick={async () => {
                    await this.addKey(
                      selectedAccount,
                      userData,
                      updateDataStateContext
                    );
                    getApiKeys(selectedAccount.key);
                  }}
                >
                  Add
                </Button>
              </Modal.Actions>
            </Modal>
          );
        }}
      </DataConsumer>
    );
  }
}
