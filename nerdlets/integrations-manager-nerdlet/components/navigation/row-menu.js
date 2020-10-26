/* eslint 
no-console: 0
*/
import React from 'react';
import { Card, Dimmer, Loader } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class RowMenu extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ updateDataStateContext, selectedPage, loadingFlex }) => {
          return (
            <Card.Group centered>
              <Card
                color={selectedPage === 'setup' ? 'green' : 'blue'}
                onClick={() =>
                  updateDataStateContext({
                    selectedPage: 'setup',
                    selectedIntegration: null,
                    selectedIntegrationType: null
                  })
                }
              >
                <Card.Content>
                  <Card.Header>Setup</Card.Header>
                  <Card.Description>
                    Deploy <strong>nri-sync</strong> into your environment.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card
                color={selectedPage === 'product' ? 'green' : 'blue'}
                onClick={() =>
                  updateDataStateContext({
                    selectedPage: 'product',
                    selectedIntegration: null,
                    selectedIntegrationType: null
                  })
                }
              >
                <Card.Content>
                  <Card.Header>Product Integrations</Card.Header>
                  <Card.Description>
                    Deploy first class integrations.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card
                color={selectedPage === 'flex' ? 'green' : 'blue'}
                onClick={() =>
                  updateDataStateContext({
                    selectedPage: 'flex',
                    selectedIntegration: null,
                    selectedIntegrationType: null
                  })
                }
              >
                <Card.Content>
                  {loadingFlex ? (
                    <Dimmer active>
                      <Loader size="small">Loading Flex Integrations...</Loader>
                    </Dimmer>
                  ) : (
                    ''
                  )}
                  <Card.Header>Flex Integrations</Card.Header>
                  <Card.Description>
                    Deploy and develop <strong>Flex</strong> integrations.
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          );
        }}
      </DataConsumer>
    );
  }
}
