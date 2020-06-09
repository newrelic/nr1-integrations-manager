import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Segment, List } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class LambdaInstall extends React.Component {
  static propTypes = {
    latest: PropTypes.object,
    activeItem: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      serverless: '',
    };
  }

  async componentDidMount() {
    const serverless = await fetch(
      'https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/configs/serverless.yml'
    ).then((response) => response.text());
    if (serverless) {
      this.setState({ serverless });
    }
  }

  render() {
    const { latest } = this.props;

    let filename = '';
    let downloadLink = '';
    let release = [];

    if (latest) {
      if (latest.assets) {
        release = latest.assets.filter((asset) =>
          asset.name.includes('Linux_x86_64')
        );
        if (release[0]) {
          downloadLink = release[0].browser_download_url;
          filename = release[0].name;
        }
      }
    }

    return (
      <Grid.Row
        style={{ display: this.props.activeItem === 'lambda' ? '' : 'none' }}
      >
        <Grid.Column>
          <Segment inverted>
            <h3>Deploying on Lambda </h3>
            <Segment inverted>
              Latest:{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={`${downloadLink}`}
              >
                {filename}
              </a>
              <List relaxed bulleted>
                <List.Item>
                  The following method, utilizes the{' '}
                  <a href="https://serverless.com">serverless framework</a> to
                  provide a one line install.
                </List.Item>
                <List.Item>
                  You may re-use or modify it as required, as long as it follows
                  the file/directory structure.
                </List.Item>
                <List.Item>
                  Within the examples/ directory of the nri-flex package, there
                  is a lambdaExample/ folder for reference.
                </List.Item>
                <List.Item>
                  Review the below serverless.yml file and modify as required.
                  <SyntaxHighlighter language="yaml" style={atomDark}>
                    {`### Example serverless.yml\n${this.state.serverless}`}
                  </SyntaxHighlighter>
                </List.Item>
                <List.Item>
                  Place your flexConfigs into "pkg/flexConfigs/*"
                </List.Item>
                <List.Item>Place the nri-flex binary into "pkg/"</List.Item>
                <List.Item>
                  Deploy with
                  <SyntaxHighlighter language="yaml" style={atomDark}>
                    sls deploy -v
                  </SyntaxHighlighter>
                </List.Item>
              </List>
            </Segment>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
