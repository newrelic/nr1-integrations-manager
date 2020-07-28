/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Card, List } from 'semantic-ui-react';
import ApiKeyBar from '../api-key-bar';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/dockerfile';
import 'brace/theme/monokai';

const dockerfile = `FROM newrelic/infrastructure-bundle:latest

COPY ./nri-sync /var/db/newrelic-infra/newrelic-integrations/bin/
COPY ./nri-sync-docker-config.yml /etc/newrelic-infra/integrations.d/

ENV NRIA_PASSTHROUGH_ENVIRONMENT="NR_UUID,NR_API_KEY,NR_ACCOUNT_ID,NR_COLLECTION"`;

const dockerConfig = `---
integrations:
  - name: nri-sync`;

export default class Setup extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({
          selectedAccount,
          uuid,
          selectedCollection,
          selectedApiKey,
          selectedPage
        }) => {
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
                <Card color={'black'} style={{ width: '100%' }}>
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
                          <List.Item href="#">Linux</List.Item>
                          <List.Item href="#">Windows</List.Item>
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
                        height={'190px'}
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
                          <List.Item href="#">Linux</List.Item>
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
                        height={'50px'}
                        width="100%"
                        value={dockerConfig}
                        editorProps={{ $blockScrolling: true }}
                        readOnly={true}
                      />

                      <br />

                      <List.Item>
                        Copy binary and config to Dockerfile and add passthrough
                        variables.
                      </List.Item>
                      <br />
                      <AceEditor
                        mode="dockerfile"
                        theme="monokai"
                        name="Dockerfile"
                        height={'105px'}
                        width="100%"
                        value={dockerfile}
                        editorProps={{ $blockScrolling: true }}
                        readOnly={true}
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
