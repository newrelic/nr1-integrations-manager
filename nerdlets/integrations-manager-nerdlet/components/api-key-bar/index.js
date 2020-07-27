/* eslint 
no-console: 0
*/
import React from 'react';
import { Card } from 'semantic-ui-react';
import Select from 'react-select';
import { DataConsumer } from '../../context/data';

export default class ApiKeyBar extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({
          selectedAccount,
          selectedApiKey,
          apiKeys,
          updateDataStateContext
        }) => {
          const hdrMessage =
            selectedAccount === null
              ? 'Select an account to view available API Keys'
              : 'Select your API Key';
          return (
            <Card color={'black'} style={{ width: '100%' }}>
              <Card.Content>
                <Card.Header style={{ paddingBottom: '5px' }}>
                  {hdrMessage}
                </Card.Header>

                <div>
                  <div className="react-select-input-group">
                    <label>Select API Key</label>
                    <Select
                      isDisabled={selectedAccount === null}
                      options={apiKeys}
                      onChange={(selectedApiKey) => {
                        updateDataStateContext({
                          selectedApiKey
                        });
                      }}
                      value={selectedApiKey}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        }}
      </DataConsumer>
    );
  }
}
