import React from 'react';
import { Modal, Button, Popup, Icon, Table } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import { navigation } from 'nr1';

const attributes = [
  'entityName',
  'collection',
  'filesWritten',
  'filesUpdated',
  'filesAlreadyUpdated',
  'filesDeleted',
  'filesInCollection',
  'errorsWriting',
  'errorsDeleting',
  'errorsReading'
];

const toCapitalizedWords = (name) => {
  const words = name.match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalize).join(' ');
};

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.substring(1);
};

export default class ReportingEntities extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { createOpen: false };
  }

  handleOpen = () => this.setState({ createOpen: true });
  handleClose = () => this.setState({ createOpen: false });

  render() {
    const { createOpen } = this.state;
    return (
      <DataConsumer>
        {({ reportingEntities }) => {
          return (
            <Modal
              closeIcon
              onClose={this.handleClose}
              open={createOpen}
              size="fullscreen"
              trigger={
                <Popup
                  content="Reporting Entities"
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
                        <Icon name="chart area" />
                      </Icon.Group>
                    </Button>
                  }
                />
              }
            >
              <Modal.Header>Reporting Entities</Modal.Header>
              <Modal.Content>
                <Table celled basic="very">
                  <Table.Header>
                    <Table.Row>
                      {attributes.map((a) => (
                        <Table.HeaderCell key={a}>
                          {toCapitalizedWords(a)}
                        </Table.HeaderCell>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {reportingEntities.map((r, i) => {
                      return (
                        <Table.Row key={i}>
                          {attributes.map((a) => {
                            if (a === 'entityName') {
                              return (
                                <Table.Cell
                                  style={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    navigation.openStackedEntity(r.entityGuid)
                                  }
                                  key={`cell_${a}`}
                                >
                                  {r[a]}&nbsp;
                                  <Icon name="external" />
                                </Table.Cell>
                              );
                            }
                            return (
                              <Table.Cell key={`cell_${a}`}>{r[a]}</Table.Cell>
                            );
                          })}
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </Modal.Content>
            </Modal>
          );
        }}
      </DataConsumer>
    );
  }
}
