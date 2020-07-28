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
  Input
} from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { AccountStorageMutation } from 'nr1';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

export default class EditCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createOpen: false,
      name: '',
      newName: '',
      isAdding: false,
      selectedDoc: null,
      originalDoc: '',
      workingDoc: '',
      isSaving: false,
      isDeleting: false,
      isCreating: false
    };
  }

  handleOpen = () => this.setState({ createOpen: true, name: '' });
  handleClose = () => this.setState({ createOpen: false, name: '' });

  writeDocument = (selectedCollection, updateDataStateContext) => {
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

  handleChange = (e, d) => {
    this.setState({
      selectedDoc: d.value,
      originalDoc: window.atob(d.doc.document.config),
      workingDoc: window.atob(d.doc.document.config)
    });
  };

  renderMenu = (selectedDoc) => {
    const { newName, originalDoc } = this.state;
    return (
      <div>
        <Header as="h5" content="Create or modify an integration" />
        <Form>
          <Form.Group>
            <Form.Input
              placeholder="New integration name..."
              value={newName}
              onChange={(e, d) => this.setState({ newName: d.value })}
              width={7}
            />
            <Form.Button
              content="Create"
              color="green"
              icon="plus"
              width={4}
              disabled={!newName}
            />
            <Form.Field style={{ float: 'right' }}>
              <Button
                color="yellow"
                icon="undo"
                disabled={!selectedDoc}
                onClick={() => this.setState({ workingDoc: originalDoc })}
              />
              <Button color="twitter" icon="save" disabled={!selectedDoc} />
              <Button
                animated
                color="red"
                loading
                disabled={!selectedDoc}
                style={{ marginBottom: '3px' }}
              >
                <Button.Content visible>
                  <Icon name="close" /> Delete
                </Button.Content>
                <Button.Content hidden>Sure?</Button.Content>
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
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
          getCollections,
          collectionData,
          updateDataStateContext,
          collectionsIndex
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
                <Grid>
                  <Grid.Row divided>
                    <Grid.Column width={4}>
                      <Header as="h5" content="Select Integration" />

                      <Form>
                        {collectionData.map((c) => (
                          <Form.Field key={c.id}>
                            <Radio
                              label={c.id}
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
                      {this.renderMenu(selectedDoc)}
                      {selectedDoc ? (
                        <>
                          <AceEditor
                            mode="yaml"
                            theme="monokai"
                            name="configuration"
                            width="100%"
                            value={workingDoc}
                            onChange={(v) => this.setState({ workingDoc: v })}
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
