/* eslint 
no-console: 0
*/
import React from 'react';
import Select from 'react-select';
import { DataConsumer } from '../../context/data';
import DeleteCollection from '../collection/del-collection';
import CreateCollection from '../collection/add-collection';
import EditCollection from '../collection/edit-collection';
import ReportingEntities from '../reporting';

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
          getCollection,
          getApiKeys,
          getAccountLicenseKey
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
                      getAccountLicenseKey(selectedAccount.key);
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
                      getCollection(selectedCollection);
                    }}
                    isDisabled={!selectedAccount}
                    value={selectedCollection}
                    classNamePrefix="react-select"
                  />
                </div>

                {selectedCollection ? <DeleteCollection /> : ''}
                {selectedCollection ? <EditCollection /> : ''}
                {selectedAccount ? (
                  <CreateCollection isDisabled={!selectedAccount} />
                ) : (
                  ''
                )}

                <div className="flex-push" />

                {selectedAccount ? <ReportingEntities /> : ''}
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
