import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Statistic, Button } from 'semantic-ui-react';

export default class Header extends React.Component {
  static propTypes = {
    flexStatusSamples: PropTypes.array.isRequired,
    flexGitRepos: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (x) => {
    this.props.handleState('set', { enableRefresh: !this.props.enableRefresh });
  };

  render() {
    return (
      <Segment inverted>
        <Statistic horizontal style={{ marginBottom: '0px' }} inverted>
          <Statistic.Label>Flex Entities &nbsp;&nbsp;</Statistic.Label>
          <Statistic.Value>
            {this.props.flexStatusSamples.length}
          </Statistic.Value>
          <Statistic.Label>Git Repositories &nbsp;&nbsp;</Statistic.Label>
          <Statistic.Value>
            {this.props.flexGitRepos
              ? Object.keys(this.props.flexGitRepos).length
              : 0}
          </Statistic.Value>
        </Statistic>
        <Statistic
          horizontal
          style={{ marginBottom: '0px', float: 'right' }}
          inverted
        >
          <Statistic.Label
            style={{
              marginBottom: '0px',
              float: 'right',
              display: this.props.loading ? '' : 'none',
            }}
          >
            {this.props.loading ? `${this.props.noAccounts} Accounts` : ''}{' '}
            &nbsp;&nbsp;
          </Statistic.Label>
          <Button.Group>
            <Button
              active={this.props.enableRefresh}
              compact
              inverted
              loading={this.props.loading}
              icon="refresh"
              compact
              inverted
              toggle
              style={{ paddingTop: '6px' }}
              onClick={this.handleClick}
            />
          </Button.Group>
        </Statistic>
      </Segment>
    );
  }
}
