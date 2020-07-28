/* eslint 
no-console: 0
*/
import React from 'react';
import { AccountStorageQuery } from 'nr1';
import Select from 'react-select';
import { DataConsumer } from '../../context/data';
import DeleteCollection from '../collection/del-collection';
import CreateCollection from '../collection/add-collection';
import EditCollection from '../collection/edit-collection';

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
          getApiKeys
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
                      getCollection(selectedCollection);
                    }}
                    isDisabled={!selectedAccount || collections.length === 0}
                    value={selectedCollection}
                    classNamePrefix="react-select"
                  />
                </div>

                {selectedCollection ? <DeleteCollection /> : ''}
                {selectedCollection ? <EditCollection /> : ''}
                {selectedAccount ? <CreateCollection /> : ''}

                <div className="flex-push" />
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
