import React from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  Grid,
  Button,
  Icon,
  List,
  Search,
  Input,
  Label,
} from 'semantic-ui-react';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

const _ = require('lodash');

export default class DeployIntegrations extends React.Component {
  static propTypes = {
    handleState: PropTypes.func.isRequired,
    exampleRepoConfigs: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  handleSearchChange = (e, { value }) => {
    const initialState = { configSearchLoading: false, results: [], value: '' };
    this.props.handleState('set', { configSearchLoading: true, value });

    setTimeout(() => {
      if (this.props.handleState('get', 'value').length < 1)
        return this.props.handleState('set', initialState);

      const re = new RegExp(
        _.escapeRegExp(this.props.handleState('get', 'value')),
        'i'
      );
      const isMatch = (result) => re.test(result.name);

      this.props.handleState('set', {
        configSearchLoading: false,
        configSearchResults: _.filter(this.props.exampleRepoConfigs, isMatch),
      });
    }, 300);
  };

  handleResultSelect = async (e, { result }) =>
    this.props.handleState('set', {
      configFileName: result.name,
      configSearchValue: result.name,
      tempConfig: await fetch(result.download_url).then((response) =>
        response.text()
      ),
    });

  render() {
    const resultRenderer = (val, i) => (
      <Label
        key={`${i}x`}
        content={val.name}
        onClick={async () =>
          this.props.handleState('set', {
            configFileName: val.name,
            tempConfig: await fetch(val.download_url).then((response) =>
              response.text()
            ),
          })
        }
      />
    );
    const saveFileName = (e, data) =>
      this.props.handleState('set', { configFileName: data.value });
    const colWidth = 4;
    const isDisabled =
      this.props.handleState('get', 'activeRepo') === '' ||
      this.props.handleState('get', 'tempConfig') === '' ||
      this.props.handleState('get', 'configFileName') === '';
    // need, alternate source, select repo, clear repo, deploy button
    return (
      <Grid.Row
        style={{
          display:
            this.props.handleState('get', 'activeItem') ===
            'deploy integrations'
              ? ''
              : 'none',
        }}
      >
        <Grid.Column width={colWidth}>
          <Search
            resultRenderer={resultRenderer}
            fluid
            loading={this.props.handleState('get', 'configSearchLoading')}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={this.props.handleState('get', 'configSearchResults')}
            value={this.props.handleState('get', 'value')}
            input={{ fluid: true }}
          />

          <Segment inverted style={{ height: '660px' }}>
            <h4>
              Examples (
              {this.props.handleState('get', 'exampleRepoConfigs').length}):
            </h4>
            <List
              selection
              inverted
              verticalAlign="middle"
              style={{ height: '600px', overflow: 'scroll' }}
            >
              {this.props
                .handleState('get', 'exampleRepoConfigs')
                .map((config, i) => {
                  return (
                    <List.Item
                      key={`list_${i}`}
                      onClick={async () => {
                        this.props.handleState('set', {
                          configFileName: config.name,
                          tempConfig: await fetch(
                            config.download_url
                          ).then((response) => response.text()),
                        });
                      }}
                    >
                      <List.Header>{config.name}</List.Header>
                    </List.Item>
                  );
                })}
            </List>
          </Segment>
        </Grid.Column>

        <Grid.Column width={12}>
          <div style={{ display: 'flex', paddingBottom: '12px' }}>
            <div>
              <Input
                label={{ color: 'black', content: 'Filename' }}
                size="large"
                labelPosition="left"
                type="text"
                placeholder="name"
                inverted
                onChange={saveFileName}
                value={this.props.handleState('get', 'configFileName')}
              />
            </div>
            <div style={{ marginLeft: '100px' }}>
              <Button.Group>
                {this.props.handleState('get', 'activeRepo') !== '' ? (
                  <Button
                    color="black"
                    onClick={() =>
                      this.props.handleState('set', {
                        activeItem: 'repositories',
                      })
                    }
                  >
                    <Icon size="small" name="exchange" />
                    {this.props.handleState('get', 'activeRepo')}
                  </Button>
                ) : (
                  <Button
                    color="black"
                    onClick={() =>
                      this.props.handleState('set', {
                        activeItem: 'repositories',
                      })
                    }
                  >
                    Select Repository
                  </Button>
                )}
                <Button.Or text="<-" />
                <Button
                  onClick={() => {
                    let repoUrl = this.props.handleState('get', 'activeRepo');

                    if (repoUrl[repoUrl.length - 1] !== '/') {
                      repoUrl += '/';
                    }

                    const filename = this.props.handleState(
                      'get',
                      'configFileName'
                    );
                    const value = encodeURIComponent(
                      this.props.handleState('get', 'tempConfig')
                    );
                    const branch = this.props.handleState('get', 'branch');

                    window.open(
                      `${repoUrl}new/${branch}?filename=${filename}&value=${value}`,
                      '_blank'
                    );
                  }}
                  positive
                  disabled={isDisabled}
                >
                  Deploy
                </Button>
              </Button.Group>
            </div>
            <div style={{ marginLeft: '15px' }}>
              <Input
                label={{ color: 'black', content: 'Branch' }}
                size="large"
                labelPosition="left"
                type="text"
                placeholder="branch"
                inverted
                onChange={(e, data) =>
                  this.props.handleState('set', { branch: data.value })
                }
                value={this.props.handleState('get', 'branch')}
                style={{ width: '125px' }}
              />
            </div>
          </div>

          <AceEditor
            mode="yaml"
            theme="monokai"
            onChange={(val) => {
              this.props.handleState('set', { tempConfig: val });
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={this.props.handleState('get', 'tempConfig')}
            style={{ width: '100%', height: '660px' }}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}
