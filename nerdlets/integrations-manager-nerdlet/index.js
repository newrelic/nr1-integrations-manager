/* 
eslint no-use-before-define: 0,
no-console: 0,
*/ // --> OFF

import React from 'react';
import { AutoSizer, PlatformStateContext } from 'nr1';
import IntegrationsManager from './components/integrations-manager';
import pkg from '../../package.json';
import { DataProvider } from './context/data';

export default class IntegrationsManagerNerdlet extends React.Component {
  render() {
    console.log(`${pkg.name}: ${pkg.version}`);

    return (
      <AutoSizer>
        {({ height }) => (
          <PlatformStateContext.Consumer>
            {(platformState) => (
              <DataProvider platformState={platformState}>
                <IntegrationsManager height={height - 96} />
              </DataProvider>
            )}
          </PlatformStateContext.Consumer>
        )}
      </AutoSizer>
    );
  }
}
