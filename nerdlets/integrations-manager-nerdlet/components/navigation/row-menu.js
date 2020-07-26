/* eslint 
no-console: 0
*/
import React from 'react';
import { Card } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class RowMenu extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ updateDataStateContext, selectedPage }) => {
          return (
            <Card.Group centered>
              <Card
                color={selectedPage === 'setup' ? 'green' : 'blue'}
                href="#setup"
                onClick={() =>
                  updateDataStateContext({ selectedPage: 'setup' })
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
                href="#product"
                onClick={() =>
                  updateDataStateContext({ selectedPage: 'product' })
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
                href="#flex"
                onClick={() => updateDataStateContext({ selectedPage: 'flex' })}
              >
                <Card.Content>
                  <Card.Header>Flex Integrations</Card.Header>
                  <Card.Description>
                    Deploy and develop Flex integrations.
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
