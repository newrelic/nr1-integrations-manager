/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';

export default class Error extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({ err, errInfo }) => {
          return <div />;
        }}
      </DataConsumer>
    );
  }
}
