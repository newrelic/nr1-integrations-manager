import React from 'react';
import {
  Modal,
  Button,
  Popup,
  Icon,
  Header,
  Grid,
  Form,
  Radio,
  Message
} from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { AccountStorageMutation } from 'nr1';
import jsyaml from 'js-yaml';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

export default class EditCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createOpen: false,
      newName: '',
      selectedDoc: null,
      originalDoc: '',
      workingDoc: '',
      isSaving: false,
      isDeleting: false,
      isCreating: false,
      yamlError: ''
    };
  }

  handleOpen = () => this.setState({ createOpen: true });
  handleClose = () => this.setState({ createOpen: false });

  createDocument = (selectedAccount, selectedCollection) => {
    const { newName } = this.state;
    return new Promise((resolve) => {
      this.setState({ isCreating: true }, () => {
        AccountStorageMutation.mutate({
          accountId: selectedAccount.key,
          actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
          collection: selectedCollection.label,
          documentId: newName,
          document: {
            config: ''
          }
        }).then((value) => {
          this.setState({ isCreating: false, newName: '' }, () => {
            resolve(value);
          });
        });
      });
    });
  };

  updateDocument = (selectedAccount, selectedCollection) => {
    const { selectedDoc, workingDoc } = this.state;
    return new Promise((resolve) => {
      this.setState({ isSaving: true }, () => {
        AccountStorageMutation.mutate({
          accountId: selectedAccount.key,
          actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
          collection: selectedCollection.label,
          documentId: selectedDoc,
          document: {
            config: window.btoa(workingDoc),
            updated: Date.now()
          }
        }).then((value) => {
          this.setState({ isSaving: false, newName: '' }, () => {
            resolve(value);
          });
        });
      });
    });
  };

  handleChange = (e, d) => {
    let doc = '';
    try {
      doc = window.atob(d.doc.document.config);
    } catch (e) {
      doc = `error_loading: ${e}`;
    }
    let yamlError = '';
    try {
      jsyaml.safeLoad(doc);
    } catch (e) {
      yamlError = e.message;
    }

    this.setState({
      selectedDoc: d.value,
      originalDoc: doc,
      workingDoc: doc,
      yamlError
    });
  };

  renderMenu = (
    getCollection,
    selectedAccount,
    selectedCollection,
    collectionData,
    selectedDoc,
    deleteDocument
  ) => {
    const {
      newName,
      originalDoc,
      isDeleting,
      isSaving,
      isCreating,
      yamlError
    } = this.state;
    const nameExists =
      (collectionData || []).filter((c) => c.id === newName).length > 0;
    return (
      <div>
        <Header as="h5" content="Create or modify an integration" />
        <Form>
          <Form.Group>
            <Form.Input
              placeholder="New integration name..."
              value={newName}
              error={nameExists}
              onChange={(e, d) =>
                this.setState({
                  newName: d.value.replace(/ /g, '-').replace(/\+/g, '-')
                })
              }
              width={6}
            />
            <Form.Button
              content="Create"
              color="green"
              loading={isCreating}
              icon="plus"
              width={4}
              disabled={!newName || nameExists ? true : false}
              onClick={async () => {
                await this.createDocument(selectedAccount, selectedCollection);
                getCollection(selectedCollection);
              }}
            />
            <Form.Field style={{ float: 'right' }}>
              <Button
                color="yellow"
                icon="undo"
                disabled={!selectedDoc ? true : false}
                onClick={() => this.setState({ workingDoc: originalDoc })}
              />
              <Button
                color="twitter"
                icon="save"
                loading={isSaving}
                disabled={!selectedDoc || yamlError ? true : false}
                onClick={async () => {
                  await this.updateDocument(
                    selectedAccount,
                    selectedCollection
                  );
                  getCollection(selectedCollection);
                }}
              />
              <Button
                animated
                color="red"
                loading={isDeleting}
                disabled={!selectedDoc ? true : false}
                style={{ marginBottom: '3px' }}
                onClick={() => {
                  this.setState({ isDeleting: true }, async () => {
                    await deleteDocument(selectedDoc);
                    getCollection(selectedCollection);
                    this.setState({
                      workingDoc: '',
                      selectedDoc: null,
                      isDeleting: false
                    });
                  });
                }}
              >
                <Button.Content visible>
                  <Icon name="close" /> Delete
                </Button.Content>
                <Button.Content hidden>Sure?</Button.Content>
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>

        {yamlError ? (
          <div style={{ paddingBottom: '10px' }}>
            <Message negative>
              <Message.Header>Invalid YAML</Message.Header>
              <p>{yamlError}</p>
            </Message>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  render() {
    const { createOpen, workingDoc } = this.state;
    return (
      <DataConsumer>
        {({
          selectedAccount,
          selectedCollection,
          getCollection,
          deleteDocument,
          collectionData
        }) => {
          const { selectedDoc } = this.state;

          return (
            <Modal
              closeIcon
              onClose={this.handleClose}
              open={createOpen}
              size="fullscreen"
              trigger={
                <Popup
                  content="Update Collection"
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
                <Grid>
                  <Grid.Row divided>
                    <Grid.Column width={4}>
                      <Header as="h5" content="Select Integration" />

                      <Form>
                        {(collectionData || []).map((c) => (
                          <Form.Field key={c.id}>
                            <Radio
                              label={c.id.replace(/\+/g, ' ')}
                              name="radioGroup"
                              value={c.id}
                              checked={selectedDoc === c.id}
                              onChange={this.handleChange}
                              doc={c}
                            />
                          </Form.Field>
                        ))}
                      </Form>
                    </Grid.Column>
                    <Grid.Column width={12}>
                      {this.renderMenu(
                        getCollection,
                        selectedAccount,
                        selectedCollection,
                        collectionData,
                        selectedDoc,
                        deleteDocument
                      )}
                      {selectedDoc ? (
                        <>
                          <AceEditor
                            mode="yaml"
                            theme="monokai"
                            name="configuration"
                            width="100%"
                            value={workingDoc}
                            onChange={(v) => {
                              let yamlError = '';
                              try {
                                jsyaml.safeLoad(v);
                              } catch (e) {
                                yamlError = e.message;
                              }
                              this.setState({ workingDoc: v, yamlError });
                            }}
                            editorProps={{ $blockScrolling: true }}
                          />
                        </>
                      ) : (
                        ''
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Modal.Content>
            </Modal>
          );
        }}
      </DataConsumer>
    );
  }
}
