import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, List, Button, Icon, Divider } from 'semantic-ui-react';

export default class RepositoryList extends React.Component {
  static propTypes = {
    handleState: PropTypes.func.isRequired,
    activeItem: PropTypes.string.isRequired,
    flexGitRepos: PropTypes.object.isRequired,
    activeRepo: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const colWidth = 8;
    return (
      <Grid.Row
        style={{
          display: this.props.activeItem === 'repositories' ? '' : 'none',
        }}
      >
        <Grid.Column width={colWidth}>
          <Segment inverted>
            <List divided relaxed inverted selection>
              {Object.keys(this.props.flexGitRepos).map((repo, i) => {
                return (
                  <List.Item
                    key={i}
                    onClick={() => this.setState({ activeRepo: repo })}
                  >
                    <List.Content floated="right">
                      <Button
                        inverted
                        onClick={() =>
                          this.props.handleState('set', {
                            activeRepo: repo,
                            activeItem: 'deploy integrations',
                          })
                        }
                      >
                        <Icon name="plus" /> Add Integration
                      </Button>
                    </List.Content>

                    <List.Icon name="git" size="large" verticalAlign="middle" />

                    <List.Content>
                      <List.Header
                        as="a"
                        onClick={() => {
                          window.open(`${repo}`, '_blank');
                        }}
                      >
                        {repo}
                      </List.Header>
                      <List.Description
                        as="a"
                        onClick={() =>
                          this.props.handleState('set', { activeRepo: repo })
                        }
                      >
                        Entities: {this.props.flexGitRepos[repo].length}{' '}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          {this.props.activeRepo ? (
            <Segment inverted>
              <h4>
                {this.props.activeRepo}{' '}
                <span
                  style={{ float: 'right' }}
                  onClick={() =>
                    this.props.handleState('set', { activeRepo: '' })
                  }
                >
                  CLEAR
                </span>
              </h4>
              <Divider />
              Targets:
              <List divided relaxed inverted>
                {this.props.activeRepo &&
                this.props.flexGitRepos[this.props.activeRepo]
                  ? this.props.flexGitRepos[this.props.activeRepo].map(
                      (entity, i) => {
                        return <List.Item key={i}>{entity}</List.Item>;
                      }
                    )
                  : 'No repository selected'}
              </List>
            </Segment>
          ) : (
            ''
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}
