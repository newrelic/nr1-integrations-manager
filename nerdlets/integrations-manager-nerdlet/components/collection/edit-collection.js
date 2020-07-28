import React from 'react';
import { Modal, Button, Popup, Icon, Input } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

export default class EditCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { createOpen: false, name: '', isAdding: false };
  }

  handleOpen = () => this.setState({ createOpen: true, name: '' });
  handleClose = () => this.setState({ createOpen: false, name: '' });

  componentDidMount() {
    console.log(this.props.selectedCollection);
  }

  addCollection = (selectedCollection, updateDataStateContext) => {
    return new Promise((resolve) => {
      this.setState({ isAdding: true }, () => {
        const { name } = this.state;

        // create collection, add to infex
        AccountStorageMutation.mutate({
          accountId: selectedAccount.key,
          actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
          collection: selectedCollection,
          documentId: 'collectionsIndex',
          document: {
            data: collectionsIndex
          }
        }).then((value) => {
          resolve(value);
        });
      });
    });
  };

  render() {
    const { createOpen, isAdding } = this.state;
    return (
      <DataConsumer>
        {({
          selectedAccount,
          selectedCollection,
          getCollections,
          updateDataStateContext,
          collectionsIndex
        }) => {
          return (
            <Modal
              closeIcon
              onClose={this.handleClose}
              open={createOpen}
              size="fullscreen"
              trigger={
                <Popup
                  content="Edit Collection"
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
                        <Icon name="pencil" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>
                <Icon name="pencil" /> {selectedCollection.label}
              </Modal.Header>
              <Modal.Content>
                <Input
                  style={{ width: '100%' }}
                  placeholder="Collection name..."
                  value={this.state.name}
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
                    await this.addCollection(
                      selectedAccount,
                      updateDataStateContext,
                      getCollections,
                      collectionsIndex
                    );
                    this.setState({ isAdding: false });
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
