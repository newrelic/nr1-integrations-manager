/* 
eslint no-use-before-define: 0,
no-console: 0,
*/ // --> OFF

import React from 'react';
import { Grid } from 'semantic-ui-react';
import MenuBar from './navigation/menu-bar';


export default class IntegrationsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const mainGridStyle = {
      height: this.props.height - 46,
      marginTop: '0px'
    };

    return (
      <div style={{ overflowY: 'hidden', overflowX: 'hidden' }}>
        <MenuBar />
        <Grid columns={16} style={mainGridStyle}>
          <Grid.Row style={{ paddingTop: '0px' }}>
            <Grid.Column width={16}>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

    );
  }
}