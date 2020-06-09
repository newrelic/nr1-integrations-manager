import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Segment, List } from 'semantic-ui-react';

export default class Download extends React.Component {
  static propTypes = {
    latest: PropTypes.object,
    activeItem: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { latest } = this.props;

    return (
      <Grid.Row
        style={{ display: this.props.activeItem === 'downloads' ? '' : 'none' }}
      >
        <Grid.Column>
          <Segment inverted>
            <List bulleted relaxed>
              {latest && latest.assets ? (
                <>
                  {latest.assets.map((a) => (
                    <List.Item key={a.name}>
                      <a rel="noopener noreferrer" target="_blank" href={a.url}>
                        {a.name}
                      </a>
                    </List.Item>
                  ))}
                </>
              ) : (
                'Loading latest assets...'
              )}
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
