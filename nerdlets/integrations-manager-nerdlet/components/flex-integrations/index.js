/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Input, Dropdown, Button } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import IntegrationTiles from '../integration-tiles.js';
import FlexInfo from './info';

export default class FlexIntegrations extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      cat: { key: 'all', text: 'All', value: 'all' }
    };
  }

  render() {
    const { searchText, cat } = this.state;

    return (
      <DataConsumer>
        {({ flexConfigs, selectedPage, selectedIntegration, pkgName }) => {
          const options = [{ key: 'all', text: 'All', value: 'all' }];

          const categories = {};
          flexConfigs.forEach((f) => {
            if (!categories[f.category]) {
              categories[f.category] = 0;
            }
            categories[f.category]++;

            if (f.type !== 'code') {
              if (!categories[f.type]) {
                categories[f.type] = 0;
              }
              categories[f.type]++;
            }
          });

          Object.keys(categories).forEach((key) => {
            options.push({
              key,
              text: `${key} (${categories[key]})`,
              value: key
            });
          });

          const searchedIntegrations = flexConfigs.filter(
            (i) =>
              i.name.toLowerCase().includes(searchText.toLowerCase()) &&
              (cat.value === 'all' ||
                i.category === cat.value ||
                i.type === cat.value)
          );

          return (
            <Grid.Row
              columns={1}
              divided
              style={{
                display: selectedPage === 'flex' ? '' : 'none',
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
                <div style={{ textAlign: 'center' }}>
                  <Dropdown
                    options={options}
                    selection
                    style={{ paddingBottom: '5px', marginTop: '3px' }}
                    value={cat.value}
                    onChange={(e, d) => this.setState({ cat: d })}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Input
                    onChange={(e, d) => this.setState({ searchText: d.value })}
                    icon="search"
                    placeholder="Search  integrations..."
                    style={{ width: '33%' }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    icon="github"
                    labelPosition="left"
                    color="green"
                    size="mini"
                    style={{ float: 'right', marginTop: '3px' }}
                    content="Contribute"
                    onClick={() =>
                      window.open(
                        'https://github.com/newrelic/nri-flex',
                        '_blank'
                      )
                    }
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                <IntegrationTiles
                  integrations={searchedIntegrations}
                  integrationType="flex"
                />
              </Grid.Column>
              {selectedIntegration && selectedPage === 'flex' ? (
                <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                  <FlexInfo
                    selectedIntegration={selectedIntegration}
                    pkgName={pkgName}
                    integrationType="flex"
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
