/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class Error extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ err, errInfo }) => {
          return (
            <div>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Header
                      as="h5"
                      content="Error:"
                      style={{
                        color: 'white',
                        paddingBottom: '0px',
                        paddingTop: '0px'
                      }}
                    />
                    <textarea value={err} readOnly />

                    <Header
                      as="h5"
                      content="Error Info:"
                      style={{
                        color: 'white',
                        paddingBottom: '0px',
                        paddingTop: '0px'
                      }}
                    />
                    <textarea value={JSON.stringify(errInfo)} readOnly />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
