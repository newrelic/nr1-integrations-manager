/* eslint 
no-console: 0
*/
import React from 'react';
import { Button } from 'semantic-ui-react';
import Select from 'react-select';
import { DataConsumer } from '../../context/data';
import DeleteCollection from '../collection/del-collection';

export default class MenuBar extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({
          accounts,
          selectedAccount,
          collections,
          selectedCollection,
          updateDataStateContext,
          getCollections,
          getApiKeys,
          apiKeys,
          selectedApiKey
        }) => {
          return (
            <div>
              <div className="utility-bar">
                <div className="react-select-input-group">
                  <label>Select Account</label>
                  <Select
                    options={accounts}
                    onChange={(selectedAccount) => {
                      updateDataStateContext({
                        selectedAccount,
                        selectedCollection: null,
                        selectedApiKey: null
                      });
                      getCollections(selectedAccount.key);
                      getApiKeys(selectedAccount.key);
                    }}
                    value={selectedAccount}
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="react-select-input-group">
                  <label>Select Collection</label>
                  <Select
                    options={collections}
                    onChange={(selectedCollection) => {
                      updateDataStateContext({
                        selectedCollection
                      });
                    }}
                    value={selectedCollection}
                    classNamePrefix="react-select"
                  />
                </div>

                {selectedCollection ? <DeleteCollection /> : ''}

                <div className="flex-push" />
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
