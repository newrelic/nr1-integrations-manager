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

    let linuxLink = '';
    let linuxName = '';
    let darwinLink = '';
    let darwinName = '';
    let winLink = '';
    let winName = '';

    if (latest) {
      if (latest.assets) {
        latest.assets.forEach((asset) => {
          if (asset.name.includes('linux')) {
            linuxLink = asset.browser_download_url;
            linuxName = asset.name;
          } else if (asset.name.includes('darwin')) {
            darwinLink = asset.browser_download_url;
            darwinName = asset.name;
          } else if (asset.name.includes('windows')) {
            winLink = asset.browser_download_url;
            winName = asset.name;
          }
        });
      }
    }

    return (
      <Grid.Row
        style={{ display: this.props.activeItem === 'downloads' ? '' : 'none' }}
      >
        <Grid.Column>
          <Segment inverted>
            <List bulleted relaxed>
              <List.Item>
                Linux:{' '}
                <a rel="noopener noreferrer" target="_blank" href={linuxLink}>
                  {linuxName}
                </a>
              </List.Item>
              <List.Item>
                Mac:{' '}
                <a rel="noopener noreferrer" target="_blank" href={darwinLink}>
                  {darwinName}
                </a>
              </List.Item>
              <List.Item>
                Windows:{' '}
                <a rel="noopener noreferrer" target="_blank" href={winLink}>
                  {winName}
                </a>
              </List.Item>
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
