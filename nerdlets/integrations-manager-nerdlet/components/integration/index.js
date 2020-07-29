/* eslint 
no-console: 0
*/
import React from 'react';
import { Segment, Menu } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';

import 'brace/mode/yaml';
import 'brace/theme/monokai';

export default class IntegrationInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'Configuration',
      standardConfig: '',
      readme: ''
    };
  }

  componentDidMount() {
    const { selectedIntegration, pkgName, integrationType } = this.props;
    if (selectedIntegration) {
      let standardUrl = selectedIntegration.standard;
      const rawGithubUrl = 'https://raw.githubusercontent.com/newrelic/';
      const repo = selectedIntegration.git.replace(
        'https://github.com/newrelic/',
        ''
      );

      if (!standardUrl.startsWith('http')) {
        standardUrl = `${rawGithubUrl}${pkgName}${standardUrl}`;
      }

      // get standard config
      fetch(standardUrl).then((response) =>
        response.text().then((data) => this.setState({ standardConfig: data }))
      );

      if (integrationType === 'product') {
        // get readme
        fetch(`${rawGithubUrl}${repo}/master/README.md`).then((response) =>
          response.text().then((data) => this.setState({ readme: data }))
        );
      }
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, standardConfig, readme, integrationType } = this.state;

    return (
      <DataConsumer>
        {({ selectedIntegrationType }) => {
          return (
            <>
              <Menu pointing secondary>
                <Menu.Item
                  name="Configuration"
                  active={activeItem === 'Configuration'}
                  onClick={this.handleItemClick}
                />
                {integrationType === 'product' ? (
                  <Menu.Item
                    name="README"
                    active={activeItem === 'README'}
                    onClick={this.handleItemClick}
                  />
                ) : (
                  ''
                )}
              </Menu>
              <div
                style={{
                  display: activeItem === 'Configuration' ? '' : 'none'
                }}
              >
                <AceEditor
                  mode="yaml"
                  theme="monokai"
                  name="configuration"
                  width="100%"
                  value={standardConfig}
                  onChange={(v) => this.setState({ standardConfig: v })}
                  editorProps={{ $blockScrolling: true }}
                />{' '}
              </div>

              {activeItem === 'README' ? (
                <ReactMarkdown
                  source={readme.split('\n').slice(1).join('\n')}
                  escapeHtml={false}
                />
              ) : (
                ''
              )}
            </>
          );
        }}
      </DataConsumer>
    );
  }
}
