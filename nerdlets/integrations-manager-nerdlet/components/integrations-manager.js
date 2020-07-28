/* 
eslint no-use-before-define: 0,
no-console: 0,
*/ // --> OFF

import React from 'react';
import { Grid, Card, Divider } from 'semantic-ui-react';
import MenuBar from './navigation/menu-bar';
import RowMenu from './navigation/row-menu';
import Setup from './setup';
import ProductIntegrations from './product-integrations';

export default class IntegrationsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const mainGridStyle = {
      // height: this.props.height - 46,
      marginTop: '0px'
    };

    return (
      <div
        style={{
          overflowY: 'hidden',
          overflowX: 'hidden',
          minHeight: this.props.height - 46
        }}
      >
        <MenuBar />
        <Grid columns={16} style={mainGridStyle}>
          <Grid.Row style={{ paddingTop: '10px', marginBottom: '2px' }}>
            <Grid.Column width={16}>
              <RowMenu />
            </Grid.Column>
          </Grid.Row>

          <Divider />

          <Setup />
          <ProductIntegrations />
        </Grid>
      </div>
    );
  }
}
