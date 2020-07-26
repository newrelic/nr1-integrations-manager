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
        {({ updateDataStateContext }) => {
          return (
            <Card.Group centered>
              <Card color="blue" href="#setup">
                <Card.Content>
                  <Card.Header>Setup</Card.Header>
                  <Card.Description>
                    Deploy <strong>nri-sync</strong> into your environment.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card color="blue" href="#product">
                <Card.Content>
                  <Card.Header>Product Integrations</Card.Header>
                  <Card.Description>
                    Deploy first class integrations.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card color="blue" href="flex">
                <Card.Content>
                  <Card.Header>Flex Integrations</Card.Header>
                  <Card.Description>
                    Deploy or develop Flex integrations.
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
