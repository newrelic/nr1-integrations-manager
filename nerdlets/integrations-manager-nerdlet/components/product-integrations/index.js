/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Input } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/monokai';
import IntegrationTiles from '../integration-tiles.js';

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
        {({ productIntegrations, selectedPage }) => {
          const searchedIntegrations = productIntegrations.filter((i) =>
            i.name.includes(searchText)
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
              <Grid.Column width={16}>
                <div style={{ textAlign: 'center' }}>
                  <Input
                    onChange={(e, d) => this.setState({ searchText: d.value })}
                    icon="search"
                    placeholder="Search integrations..."
                    style={{ width: '33%' }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                <IntegrationTiles integrations={searchedIntegrations} />
              </Grid.Column>
            </Grid.Row>
          );
        }}
      </DataConsumer>
    );
  }
}
