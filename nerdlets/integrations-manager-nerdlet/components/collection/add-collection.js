import React from 'react';
import { Modal, Button, Popup, Icon, Input, Message } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { AccountStorageMutation } from 'nr1';

export default class CreateCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { createOpen: false, name: '', isAdding: false };
  }

  handleOpen = () => this.setState({ createOpen: true, name: '' });
  handleClose = () => this.setState({ createOpen: false, name: '' });

  addCollection = (
    selectedAccount,
    updateDataStateContext,
    getCollections,
    collectionsIndex
  ) => {
    return new Promise((resolve) => {
      this.setState({ isAdding: true }, () => {
        const { name } = this.state;

        collectionsIndex.push(name);

        // create collection, add to infex
        AccountStorageMutation.mutate({
          accountId: selectedAccount.key,
          actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
          collection: 'collectionsIndex',
          documentId: 'collectionsIndex',
          document: {
            data: collectionsIndex
          }
        }).then((value) => {
          getCollections(selectedAccount.key);

          updateDataStateContext({
            collectionData: null,
            selectedCollection: {
              key: `${name}:::${selectedAccount.key}`,
              value: name,
              label: name,
              text: name,
              collectionAccountId: selectedAccount.key,
              accountId: selectedAccount.key
            }
          });

          resolve(value);
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
          getCollections,
          updateDataStateContext,
          collectionsIndex,
          collections
        }) => {
          const collectionExists =
            collections.filter((c) => c.label === name).length > 0;
          return (
            <Modal
              closeIcon
              onClose={this.handleClose}
              open={createOpen}
              size="tiny"
              trigger={
                <Popup
                  content="Create Collection"
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
                        <Icon name="plus" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>Create Collection</Modal.Header>
              <Modal.Content>
                <Input
                  style={{ width: '100%' }}
                  placeholder="Collection name..."
                  value={this.state.name}
                  onChange={(e, d) => this.setState({ name: d.value })}
                />
                {collectionExists ? (
                  <Message negative>
                    Collection already exists, please try another name.
                  </Message>
                ) : (
                  ''
                )}
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
                  disabled={collectionExists}
                  positive
                  loading={isAdding}
                  onClick={async () => {
                    await this.addCollection(
                      selectedAccount,
                      updateDataStateContext,
                      getCollections,
                      collectionsIndex
                    );
                    this.setState({ isAdding: false, createOpen: false });
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
