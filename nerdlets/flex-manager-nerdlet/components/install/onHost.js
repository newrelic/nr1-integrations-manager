import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Segment } from 'semantic-ui-react';

export default class OnHost extends React.Component {
  static propTypes = {
    activeItem: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid.Row
        style={{
          display: this.props.activeItem === 'on host' ? '' : 'none',
        }}
      >
        <Grid.Column>
          <Segment inverted>
            <h3>Flex is installed by default on Linux and Windows Hosts.</h3>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
