/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Input, Button, Divider } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import IntegrationTiles from '../integration-tiles.js';
import ProductIntegrationInfo from './info';

export default class ProductIntegrations extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };
  }

  render() {
    const { searchText } = this.state;

    return (
      <DataConsumer>
        {({
          productIntegrations,
          selectedPage,
          selectedIntegration,
          pkgName
        }) => {
          const searchedIntegrations = productIntegrations.filter((i) =>
            i.name.toLowerCase().includes(searchText.toLowerCase())
          );

          return (
            <Grid.Row
              columns={1}
              divided
              style={{
                display: selectedPage === 'product' ? '' : 'none',
                paddingLeft: '10px',
                paddingRight: '10px',
                marginBottom: '10px',
                paddingTop: '0px'
              }}
            >
              <Grid.Column
                width={16}
                style={{
                  paddingBottom: '10px',
                  display: selectedIntegration ? 'none' : ''
                }}
              >
                <div>
                  <Input
                    onChange={(e, d) => this.setState({ searchText: d.value })}
                    icon="search"
                    placeholder="Search integrations..."
                    style={{ width: '33%', marginLeft: '33%' }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    icon="external"
                    labelPosition="left"
                    color="blue"
                    size="mini"
                    style={{ float: 'right', marginTop: '3px' }}
                    content="View all integrations"
                    onClick={() =>
                      window.open(
                        'https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list',
                        '_blank'
                      )
                    }
                  />
                </div>
                <Divider />
              </Grid.Column>
              <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                <IntegrationTiles
                  integrations={searchedIntegrations}
                  integrationType="product"
                />
              </Grid.Column>
              {selectedIntegration && selectedPage === 'product' ? (
                <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                  <ProductIntegrationInfo
                    selectedIntegration={selectedIntegration}
                    pkgName={pkgName}
                    integrationType="product"
                  />
                </Grid.Column>
              ) : (
                ''
              )}
            </Grid.Row>
          );
        }}
      </DataConsumer>
    );
  }
}
