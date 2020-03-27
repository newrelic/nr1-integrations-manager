import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class DockerInstall extends React.Component {
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
        style={{ display: this.props.activeItem == 'docker' ? '' : 'none' }}
      >
        <Grid.Column>
          <Segment inverted>
            <h3>Building and running a Docker Image & Container </h3>
            Latest:{' '}
            <a rel="noopener noreferrer" target="_blank" href={downloadLink}>
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
                `### Create Flex Configs directory \n` +
                `mkdir flexConfigs \n\n` +
                `### Add your Flex Configs to /flexConfigs/ directory \n\n` +
                `### Review nri-flex-config.yml & modify if required \n` +
                `cat nri-flex-config.yml \n\n` +
                `### Review nri-flex-definition.yml & modify if required \n` +
                `cat nri-flex-definition.yml \n\n` +
                `### Review the Dockerfile and modify accordingly to add/copy your required Flex Configs \n` +
                `cat Dockerfile \n\n` +
                `### Build \n` +
                `docker build -t nri-flex . \n\n` +
                `### Run (add your license key and any other parameters) \n` +
                `docker run -d --name nri-flex --network=host --cap-add=SYS_PTRACE -v "/:/host:ro" -v "/var/run/docker.sock:/var/run/docker.sock" -e NRIA_LICENSE_KEY="yourInfraLicenseKey" nri-flex:latest \n`}
            </SyntaxHighlighter>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
