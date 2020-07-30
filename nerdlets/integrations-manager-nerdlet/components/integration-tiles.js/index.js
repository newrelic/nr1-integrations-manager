/* eslint 
no-console: 0
*/
import React from 'react';
import { Card, Header, Icon, Image } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class IntegrationTiles extends React.PureComponent {
  render() {
    const { integrations, integrationType } = this.props;
    return (
      <DataConsumer>
        {({ updateDataStateContext, selectedIntegration }) => {
          return (
            <Card.Group centered={!selectedIntegration}>
              {selectedIntegration ? (
                <Card
                  color="black"
                  style={{ width: '50px' }}
                  href="#"
                  onClick={() =>
                    updateDataStateContext({
                      selectedIntegration: null,
                      selectedIntegrationType: null
                    })
                  }
                >
                  <Card.Content style={{ marginTop: '15px' }}>
                    <Header as="h4">
                      <Icon name="left arrow" />
                    </Header>
                  </Card.Content>
                </Card>
              ) : (
                ''
              )}
              {integrations
                .filter((i) =>
                  selectedIntegration
                    ? i.name === selectedIntegration.name
                    : true
                )
                .map((i, z) => {
                  const icon = integrationType === 'flex' ? i.type : '';

                  return (
                    <Card
                      key={z}
                      href="#"
                      color={selectedIntegration ? 'green' : 'black'}
                      onClick={() => {
                        if (!selectedIntegration) {
                          updateDataStateContext({
                            selectedIntegrationType: integrationType,
                            selectedIntegration: i
                          });
                        } else {
                          updateDataStateContext({
                            selectedIntegrationType: null,
                            selectedIntegration: null
                          });
                        }
                      }}
                    >
                      <Card.Content>
                        {i.image && icon === '' ? (
                          <Image floated="left" size="mini" src={i.image} />
                        ) : (
                          ''
                        )}

                        <Card.Header style={{ marginTop: '10px' }}>
                          <div style={{ float: 'left' }}>
                            {icon !== '' ? (
                              <Icon style={{ float: 'left' }} name={icon} />
                            ) : (
                              ''
                            )}
                            {i.name}
                          </div>
                          {i.git ? (
                            <div
                              style={{ float: 'right' }}
                              onClick={() => window.open(i.git, '_blank')}
                            >
                              <Icon
                                name="github"
                                color="green"
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          ) : (
                            ''
                          )}
                        </Card.Header>
                      </Card.Content>
                    </Card>
                  );
                })}
            </Card.Group>
          );
        }}
      </DataConsumer>
    );
  }
}
