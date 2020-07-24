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
        {({ updateDataStateContext, selectedAccount }) => {
          return (
            <div>
              <div className="utility-bar">
                <div className="react-select-input-group">
                  <label>Select Account</label>
                  <Select
                    // options={accountOptions}
                    // onChange={async d => {
                    //   await updateDataStateContext({
                    //     storageLocation: d
                    //   });
                    //   selectMap(null, true);
                    //   dataFetcher(['accountMaps']);
                    // }}
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
