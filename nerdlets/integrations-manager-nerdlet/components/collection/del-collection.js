import React from 'react';
import { Modal, Button, Popup, Icon } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { AccountStorageMutation, AccountStorageQuery } from 'nr1';
import gql from 'graphql-tag';

export default class DeleteCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { deleteOpen: false };
  }

  handleOpen = () => this.setState({ deleteOpen: true });
  handleClose = () => this.setState({ deleteOpen: false });

  deleteCollection = (selectedCollection, collectionsIndex) => {
    return new Promise((resolve) => {
      // remove collection
      AccountStorageMutation.mutate({
        accountId: parseInt(
          selectedCollection.collectionAccountId || selectedCollection.accountId
        ),
        actionType: AccountStorageMutation.ACTION_TYPE.DELETE_COLLECTION,
        collection: selectedCollection.value
      }).then(async (value) => {
        //remove from index collection
        if (collectionsIndex) {
          collectionsIndex = collectionsIndex.filter(
            (c) => c !== selectedCollection.value
          );
          AccountStorageMutation.mutate({
            accountId: selectedCollection.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            documentId: 'collectionsIndex',
            collection: 'collectionsIndex',
            document: {
              data: collectionsIndex
            }
          }).then((value2) => {
            resolve({ collectionDelete: value, indexDelete: value2 });
          });
        }
      });
    });
  };

  render() {
    const { deleteOpen } = this.state;
    return (
      <DataConsumer>
        {({
          selectedCollection,
          selectedAccount,
          getCollections,
          collectionsIndex,
          updateDataStateContext
        }) => {
          return (
            <Modal
              onClose={this.handleClose}
              open={deleteOpen}
              size="tiny"
              trigger={
                <Popup
                  content="Delete Collection"
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
              <Modal.Header>Delete Collection</Modal.Header>
              <Modal.Content>
                Note: if an entity is still syncing with this collection it will
                continue to appear in this list. Are you sure you want to delete
                <strong> {selectedCollection.label}</strong>?
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
                  onClick={async () => {
                    await this.deleteCollection(
                      selectedCollection,
                      collectionsIndex
                    );
                    updateDataStateContext({ selectedCollection: null });
                    getCollections(selectedAccount.key);
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
