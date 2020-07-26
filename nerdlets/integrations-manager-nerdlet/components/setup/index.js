/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class Setup extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({
          selectedAccount,
          uuid,
          selectedCollection,
          apiKeys,
          selectedPage
        }) => {
          return (
            <Grid.Row
              columns={2}
              style={{
                display: selectedPage === 'setup' ? '' : 'none',
                paddingLeft: '10px',
                paddingRight: '10px',
                marginBottom: '10px'
              }}
            >
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>On Host</Card.Header>
                  </Card.Content>
                  <Card.Content>abc</Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>Container</Card.Header>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          );
        }}
      </DataConsumer>
    );
  }
}
