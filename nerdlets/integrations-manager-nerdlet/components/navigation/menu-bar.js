/* eslint 
no-console: 0
*/
import React from 'react';
import { Button } from 'semantic-ui-react';
import Select from 'react-select';
import { DataConsumer } from '../../context/data';

export default class MenuBar extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ accounts, selectedAccount, updateDataStateContext }) => {
          return (
            <div>
              <div className="utility-bar">
                <div className="react-select-input-group">
                  <label>Select Account</label>
                  <Select
                    options={accounts}
                    onChange={(selectedAccount) => {
                      updateDataStateContext({
                        selectedAccount
                      });
                    }}
                    value={selectedAccount}
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="flex-push" />
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
