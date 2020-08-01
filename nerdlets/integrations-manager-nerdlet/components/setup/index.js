/* eslint 
no-console: 0
*/
import React from 'react';
import {
  Grid,
  Card,
  List,
  Divider,
  Header,
  Form,
  Radio
} from 'semantic-ui-react';
import ApiKeyBar from '../api-key-bar';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/sh';
import 'brace/mode/dockerfile';
import 'brace/theme/monokai';

const dockerfile = (image) => `FROM ${image}:latest

COPY ./nri-sync /var/db/newrelic-infra/newrelic-integrations/bin/
RUN chmod +x /var/db/newrelic-infra/newrelic-integrations/bin/nri-sync
COPY ./nri-sync-docker-config.yml /etc/newrelic-infra/integrations.d/

ENV NRIA_PASSTHROUGH_ENVIRONMENT="NR_UUID,NR_API_KEY,NR_ACCOUNT_ID,NR_COLLECTION"`;

const dockerConfig = `---
integrations:
  - name: nri-sync`;

const generateDockerCommand = (
  license,
  uuid,
  accountId,
  collection,
  apiKey
) => `docker run \\
    -d \\
    --name newrelic-infra \\
    --network=host \\
    --cap-add=SYS_PTRACE \\
    -v "/:/host:ro" \\
    -v "/var/run/docker.sock:/var/run/docker.sock" \\
    -e NRIA_LICENSE_KEY="${license}" \\
    -e NR_UUID="${uuid}" \\
    -e NR_ACCOUNT_ID="${accountId}" \\
    -e NR_COLLECTION="${collection}" \\
    -e NR_API_KEY="${apiKey}" \\
    nri-sync:latest`;

export default class Setup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: 'standard' };
  }

  handleChange = (e, { value }) => this.setState({ value });

  render() {
    const { value } = this.state;

    const image =
      value === 'standard'
        ? 'newrelic/infrastructure-bundle'
        : 'newrelic/infrastructure-k8s';

    return (
      <DataConsumer>
        {({
          selectedAccount,
          uuid,
          selectedCollection,
          selectedApiKey,
          selectedPage,
          accountLicenseKey
        }) => {
          const licenseKey = accountLicenseKey
            ? accountLicenseKey
            : '<insert account license key>';

          const apiKey =
            (selectedApiKey && selectedApiKey.value) ||
            '<Select API Key eg. NRAK-123... >';
          const collection =
            (selectedCollection && selectedCollection.label) ||
            '<Select collection eg. netw-integrations>';
          const accountId =
            (selectedAccount && selectedAccount.key) ||
            '<Select account eg. 12345678>';
          const theUuid = uuid || 'eg. 4c2c66ea-c13d-4b95-9c9a-64183fe68290';
          const integrationsConfig = `---
  integrations:
    - name: nri-sync
      env:
        # integrations manager nerdpack uuid
        NR_UUID: "${theUuid}"
        # account that contains your config collection
        NR_ACCOUNT_ID: ${accountId}
        # name of config collection to sync
        NR_COLLECTION: "${collection}"
        # new relic one user api key
        NR_API_KEY: "${apiKey}"`;

          return (
            <Grid.Row
              columns={2}
              divided
              style={{
                display: selectedPage === 'setup' ? '' : 'none',
                paddingLeft: '10px',
                paddingRight: '10px',
                marginBottom: '10px'
              }}
            >
              <Grid.Column width={16} style={{ paddingBottom: '20px' }}>
                <Card color="black" style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>How does it work?</Card.Header>

                    <Card.Description>
                      <List bulleted>
                        <List.Item>
                          A collection containing your infrastructure
                          integration configuration files are synced to your
                          target infrastructure using <strong>nri-sync</strong>.
                        </List.Item>
                        <List.Item>
                          To begin setup, select an account followed by a
                          collection or create a new collection which will
                          contain your integrations for a particular
                          environment.
                        </List.Item>
                        <List.Item>
                          Select an API key and your configuration file will be
                          prepopulated.
                        </List.Item>
                        <List.Item>
                          Choose your required deployment model.
                        </List.Item>
                        <List.Item>
                          Select your integrations collection, and deploy your
                          required integrations.
                        </List.Item>
                        <List.Item>
                          Remember to modify the integration config files to
                          your environment specifications.
                        </List.Item>
                      </List>
                    </Card.Description>
                  </Card.Content>
                </Card>

                <ApiKeyBar />
              </Grid.Column>
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>On Host</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <List bulleted>
                      <List.Item>
                        Download <strong>nri-sync</strong>
                        <List.List>
                          <List.Item href="https://github.com/newrelic/nr1-flex-manager/raw/master/package/nri-sync">
                            Linux
                          </List.Item>
                          <List.Item href="https://github.com/newrelic/nr1-flex-manager/raw/master/package/nri-sync.exe">
                            Windows
                          </List.Item>
                        </List.List>
                      </List.Item>
                      <List.Item>
                        Save the binary to the following location:
                        <List.List>
                          <List.Item style={{ paddingBottom: '5px' }}>
                            Linux:
                            <List.Item>
                              /var/db/newrelic-infra/newrelic-integrations/bin/
                              <strong>nri-sync</strong>
                            </List.Item>
                          </List.Item>
                          <List.Item>
                            Windows:
                            <List.Item>
                              C:\Program Files\New
                              Relic\newrelic-infra\newrelic-integrations\
                              <strong>nri-sync.exe</strong>
                            </List.Item>
                          </List.Item>
                        </List.List>
                      </List.Item>
                      <List.Item>
                        Configuration file: <strong>nri-sync-config.yml</strong>
                      </List.Item>
                      Use the above dropdowns to prepopulate your config file,
                      or input manully.
                      <br /> <br />
                      <AceEditor
                        mode="yaml"
                        theme="monokai"
                        name="configuration"
                        height="190px"
                        width="100%"
                        value={integrationsConfig}
                        editorProps={{ $blockScrolling: true }}
                      />
                      <br />
                      <List.Item>
                        Save the configuration to the following location:
                        <List.List>
                          <List.Item style={{ paddingBottom: '5px' }}>
                            Linux:
                            <List.Item>
                              /etc/newrelic-infra/integrations.d/
                              <strong>nri-sync-config.yml</strong>
                            </List.Item>
                          </List.Item>
                          <List.Item>
                            Windows:
                            <List.Item>
                              C:\Program Files\New
                              Relic\newrelic-infra\integrations.d\
                              <strong>nri-sync-config.yml</strong>
                            </List.Item>
                          </List.Item>
                        </List.List>
                      </List.Item>
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>Container</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <List bulleted>
                      <List.Item>
                        Download <strong>nri-sync</strong>
                        <List.List>
                          <List.Item href="https://github.com/newrelic/nr1-flex-manager/raw/master/package/nri-sync">
                            Linux
                          </List.Item>
                        </List.List>
                      </List.Item>
                      <List.Item>
                        Save <strong>nri-sync-docker-config.yml</strong>
                      </List.Item>
                      <br />
                      <AceEditor
                        mode="yaml"
                        theme="monokai"
                        name="dockerSyncConfig"
                        height="50px"
                        width="100%"
                        value={dockerConfig}
                        editorProps={{ $blockScrolling: true }}
                        readOnly
                      />

                      <br />

                      <List.Item>
                        Copy binary and config to Dockerfile and add passthrough
                        variables.
                      </List.Item>
                      <List.Item>
                        <Form style={{ fontSize: '12px' }}>
                          <Form.Field>
                            Select required deployment image: <b>{value}</b>
                          </Form.Field>
                          <Form.Field>
                            <Radio
                              label="Standard Docker"
                              name="radioGroup"
                              value="standard"
                              checked={value === 'standard'}
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Radio
                              label="Kubernetes"
                              name="radioGroup"
                              value="Kubernetes"
                              checked={value === 'Kubernetes'}
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                        </Form>
                      </List.Item>
                      <br />
                      <AceEditor
                        mode="dockerfile"
                        theme="monokai"
                        name="Dockerfile"
                        height="105px"
                        width="100%"
                        value={dockerfile(image)}
                        editorProps={{ $blockScrolling: true }}
                        readOnly
                      />
                      <br />
                      <List.Item>
                        Alternatively you can bake separate images with the
                        environment variables defined in each.
                      </List.Item>
                      <List.Item>Build the docker image.</List.Item>
                      <List.Item>
                        Use the following environment variables during
                        deployment. Use the above dropdowns to populate, or
                        manually define yourself.
                        <br /> <br />
                        <List.Item>
                          <strong>NR_UUID</strong>="{theUuid}"
                        </List.Item>
                        <List.Item>
                          <strong>NR_ACCOUNT_ID</strong>="{accountId}"
                        </List.Item>
                        <List.Item>
                          <strong>NR_COLLECTION</strong>="{collection}"
                        </List.Item>
                        <List.Item>
                          <strong>NR_API_KEY</strong>="{apiKey}"
                        </List.Item>
                      </List.Item>
                    </List>
                    <Divider />
                    <Header as="h5">Example Docker run command</Header>
                    <div>
                      <AceEditor
                        mode="shell"
                        theme="monokai"
                        name="command"
                        height="200px"
                        width="100%"
                        value={generateDockerCommand(
                          licenseKey,
                          uuid,
                          accountId,
                          collection,
                          apiKey
                        )}
                        editorProps={{ $blockScrolling: true }}
                        readOnly
                      />
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          );
        }}
      </DataConsumer>
    );
  }
}
