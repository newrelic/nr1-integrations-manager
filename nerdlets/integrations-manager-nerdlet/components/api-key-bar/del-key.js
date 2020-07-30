import React from 'react';
import { Modal, Button, Popup, Icon } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { NerdGraphMutation } from 'nr1';
import gql from 'graphql-tag';
import { deleteApiKeyQuery } from '../../context/queries';

export default class DeleteKey extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { deleteOpen: false, isDeleting: false };
  }

  handleOpen = () => this.setState({ deleteOpen: true });
  handleClose = () => this.setState({ deleteOpen: false });

  deleteKey = (selectedApiKey) => {
    return new Promise((resolve) => {
      this.setState({ isDeleting: true }, () => {
        // delete key
        NerdGraphMutation.mutate({
          mutation: gql`
            ${deleteApiKeyQuery(selectedApiKey.key)}
          `
        }).then((value) => {
          this.setState({ isDeleting: false }, () => resolve(value));
        });
      });
    });
  };

  render() {
    const { deleteOpen, isDeleting } = this.state;
    return (
      <DataConsumer>
        {({
          selectedApiKey,
          selectedAccount,
          getApiKeys,
          updateDataStateContext
        }) => {
          return (
            <Modal
              onClose={this.handleClose}
              open={deleteOpen}
              size="tiny"
              trigger={
                <Popup
                  content="Delete API Key"
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
                        <Icon name="trash alternate outline" color="red" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>Delete API Key</Modal.Header>
              <Modal.Content>
                Are you sure you want to delete
                <strong> {selectedApiKey.label}</strong>?
              </Modal.Content>
              <Modal.Actions>
                <Button
                  style={{ float: 'left' }}
                  positive
                  onClick={this.handleClose}
                >
                  Don't Delete
                </Button>

                <Button
                  negative
                  loading={isDeleting}
                  onClick={async () => {
                    await this.deleteKey(selectedApiKey);
                    updateDataStateContext({
                      selectedApiKey: null
                    });
                    getApiKeys(selectedAccount.key);
                    this.setState({ isDeleting: false });
                  }}
                >
                  Delete!
                </Button>
              </Modal.Actions>
            </Modal>
          );
        }}
      </DataConsumer>
    );
  }
}
