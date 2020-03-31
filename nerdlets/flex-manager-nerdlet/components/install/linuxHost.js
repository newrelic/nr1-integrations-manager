import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Segment, Divider } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class LinuxInstall extends React.Component {
  static propTypes = {
    latest: PropTypes.object,
    activeItem: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { latest } = this.props;

    let filebase = '';
    let filename = '';
    let downloadLink = '';
    let release = [];

    if (latest) {
      if (latest.assets) {
        release = latest.assets.filter((asset) => asset.name.includes('linux'));
        if (release[0]) {
          downloadLink = release[0].browser_download_url;
          filename = release[0].name;
          filebase = release[0].name.replace('.tar.gz', '');
        }
      }
    }

    return (
      <Grid.Row
        style={{
          display: this.props.activeItem === 'linux host' ? '' : 'none',
        }}
      >
        <Grid.Column>
          <Segment inverted>
            <h3>
              Automated Install on Linux with defaults and without any Flex
              Configs
            </h3>
            <Segment inverted>
              <SyntaxHighlighter language="bash" style={atomDark}>
                {'### Install\n' +
                  'sudo bash -c "$(curl -L https://newrelic-flex.s3-ap-southeast-2.amazonaws.com/install_linux_s3.sh)"\n\n' +
                  '### Browse to the below directory to add your Flex Configs\n' +
                  'cd /var/db/newrelic-infra/custom-integrations/flexConfigs'}
              </SyntaxHighlighter>
            </Segment>
            <Divider />
            <h3>Standard Install</h3>
            <Segment inverted>
              Latest:{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={`${downloadLink}`}
              >
                {filename}
              </a>
              <SyntaxHighlighter language="bash" style={atomDark}>
                {`${
                  '### Download\n' +
                  `curl -L -o ${filename} "${downloadLink}"\n` +
                  '### or download with wget\n' +
                  `wget ${downloadLink}\n\n` +
                  '### Extract\n' +
                  'tar xvf '
                }${filename}\n\n` +
                  `### Enter Directory\n` +
                  `cd ${filebase}/\n\n` +
                  `### Add your Flex Configs to /flexConfigs/ directory \n\n` +
                  `### Review nri-flex-config.yml & modify if required \n` +
                  `cat nri-flex-config.yml \n\n` +
                  `### Review nri-flex-definition.yml & modify if required \n` +
                  `cat nri-flex-definition.yml \n\n` +
                  `### Review the commented out portions in 'install_linux.sh' & modify if required \n` +
                  `cat install_linux.sh \n\n` +
                  `### Install \n` +
                  `sudo ./install_linux.sh \n`}
              </SyntaxHighlighter>
            </Segment>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
