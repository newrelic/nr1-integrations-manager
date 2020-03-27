import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Segment, List } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class KubernetesInstall extends React.Component {
  static propTypes = {
    activeItem: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      k8s: '',
      nriFlexConfig: '',
    };
  }

  async componentDidMount() {
    let nriFlexConfig = await fetch(
      'https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/configs/nri-flex-config.yml'
    ).then((response) => response.text());
    if (nriFlexConfig) {
      nriFlexConfig = nriFlexConfig.replace(
        '# container_discovery',
        'container_discovery'
      );
      this.setState({ nriFlexConfig });
    }
    const k8s = await fetch(
      'https://raw.githubusercontent.com/newrelic/nri-flex/master/examples/nri-flex-k8s.yml'
    ).then((response) => response.text());
    if (k8s) {
      this.setState({ k8s });
    }
  }

  render() {
    const downloadLink = `https://raw.githubusercontent.com/newrelic/nri-flex/master/examples/nri-flex-k8s.yml`;
    return (
      <Grid.Row
        style={{
          display: this.props.activeItem === 'kubernetes' ? '' : 'none',
        }}
      >
        <Grid.Column>
          <Segment inverted>
            <h3>Deploying as a Daemonset</h3>
            <Segment inverted>
              <List relaxed bulleted>
                <List.Item>
                  Build your customized Docker Image as in the Docker Install
                  Steps.
                </List.Item>
                <List.Item>
                  If using Container Discovery, ensure the container_discovery
                  parameter is set to true in "nri-flex-config.yml".
                  <br />
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/newrelic/nri-flex/wiki/Service-Discovery#V2-Container-Discovery"
                  >
                    View the documentation for more detail on how containers are
                    targeted.
                  </a>
                  <SyntaxHighlighter language="yaml" style={atomDark}>
                    {`### Example nri-flex-config.yml with container_discovery mode enabled\n${this.state.nriFlexConfig}`}
                  </SyntaxHighlighter>
                </List.Item>
                <List.Item>
                  Flex K8s Daemonset Download:{' '}
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`${downloadLink}`}
                  >
                    nri-flex-k8s.yml
                  </a>
                </List.Item>
                <List.Item>
                  Ensure you update the Kubernetes Deployment yaml file with
                  your Flex image, and NRIA license key.
                </List.Item>
                <List.Item>
                  Install
                  <SyntaxHighlighter language="yaml" style={atomDark}>
                    kubectl create -f nri-flex-k8s.yml
                  </SyntaxHighlighter>
                </List.Item>
                <List.Item>
                  Example K8s Deployment yaml
                  <SyntaxHighlighter language="yaml" style={atomDark}>
                    {this.state.k8s}
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
