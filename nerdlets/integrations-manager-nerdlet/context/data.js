/* eslint 
no-console: 0,
no-async-promise-executor: 0,
require-atomic-updates: 0,
no-unused-vars: 0,
react/no-did-update-set-state: 0
*/

import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  NerdGraphQuery,
  AccountStorageQuery,
  AccountStorageMutation
} from 'nr1';
import { Icon } from 'semantic-ui-react';
import pkg from '../../../package.json';
import gql from 'graphql-tag';
import { accountsQuery } from './queries';
import { existsInArray } from './utils';

const semver = require('semver');

const DataContext = React.createContext();

export const loadingMsg = (msg) => (
  <>
    <Icon name="spinner" loading />
    {msg}
  </>
);

export const successMsg = (msg) => (
  <>
    <Icon name="check" />
    {msg}
  </>
);

export class DataProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPage: 'home',
      selectedAccount: null,
      selectedCollection: null,
      accounts: [],
      collections: [],
      reportingEntities: [],
      hasError: false,
      err: null,
      errInfo: null
    };
  }

  async componentDidMount() {
    this.checkVersion();
    await this.getAccounts();

    if (this.state.accounts.length === 0) {
      toast.error('Unable to load accounts, please check your nerdpack uuid.', {
        autoClose: 10000,
        containerId: 'B'
      });
    }
  }

  componentDidCatch(err, errInfo) {
    this.setState({ hasError: true, err, errInfo });
  }

  getAccounts = () => {
    return new Promise((resolve) => {
      NerdGraphQuery.query({
        query: gql`
          ${accountsQuery}
        `
      }).then((value) => {
        const accountData =
          (((value || {}).data || {}).actor || {}).accounts || [];

        const accounts = accountData.map((acc) => ({
          key: acc.id,
          value: acc.id,
          label: acc.name,
          text: acc.name,
          hasSync:
            acc.reportingEventTypes.filter((event) => event === 'NriSyncSample')
              .length > 0
        }));

        this.setState({ accounts }, () => resolve(true));
      });
    });
  };

  getCollections = async (accountId) => {
    // get collections from NriSyncSamples
    const attributes = [
      'collection',
      'collectionAccountId',
      'filesWritten',
      'filesUpdated',
      'filesAlreadyUpdated',
      'filesDeleted',
      'filesInCollection',
      'errorsWriting',
      'errorsDeleting',
      'errorsReading',
      'entityName'
    ];

    let attributeString = '';
    attributes.forEach((a, i) => {
      attributeString += `latest(${a}) as '${a}'${
        attributes.length === i + 1 ? '' : ','
      }`;
    });

    const snycQuery = `{
      actor {
        account(id: ${accountId}) {
          nrql(query: "FROM NriSyncSample SELECT ${attributeString} FACET entityGuid SINCE 5 minutes ago LIMIT MAX") { 
            results
          }
        }
      }
    }`;

    NerdGraphQuery.query({
      query: gql`
        ${snycQuery}
      `
    }).then(async (value) => {
      const reportingEntities =
        (((((value || {}).data || {}).actor || {}).account || {}).nrql || {})
          .results || [];

      // get collections from collectionsIndex
      let collectionsIndex = await AccountStorageQuery.query({
        accountId,
        collection: 'collectionsIndex',
        documentId: 'collectionsIndex'
      });
      collectionsIndex = ((collectionsIndex || {}).data || {}).data || [];

      const collections = collectionsIndex.map((c) => ({
        key: `${c}:${accountId}`,
        value: c,
        label: c,
        text: c,
        accountId
      }));

      reportingEntities.forEach((r) => {
        // avoid duplicates
        let collectionExists = existsInArray(
          collections,
          `${r.collection}:${r.collectionAccountId}`,
          'key'
        );

        if (!collectionExists) {
          collections.push({
            key: `${r.collection}:${r.collectionAccountId}`,
            value: r.collection,
            label: r.collection,
            text: r.collection,
            collectionAccountId: r.collectionAccountId,
            accountId
          });
        }
      });

      this.setState({ collections, reportingEntities });
    });
  };

  updateDataStateContext = (stateData, actions) => {
    return new Promise((resolve) => {
      this.setState(stateData, () => {
        resolve(true);
      });
    });
  };

  checkVersion = async () => {
    fetch(
      'https://raw.githubusercontent.com/newrelic/nr1-flex-manager/master/package.json'
    )
      .then((response) => {
        return response.json();
      })
      .then((repoPackage) => {
        if (pkg.version === repoPackage.version) {
          console.log(`Running latest version: ${pkg.version}`);
        } else if (semver.lt(pkg.version, repoPackage.version)) {
          toast.warn(
            <a
              onClick={() =>
                window.open(
                  'https://github.com/newrelic/nr1-flex-manager/',
                  '_blank'
                )
              }
            >{`New version available: ${repoPackage.version}`}</a>,
            {
              autoClose: 5000,
              containerId: 'C'
            }
          );
        }
      });
  };

  render() {
    const { children } = this.props;

    return (
      <DataContext.Provider
        value={{
          ...this.state,
          updateDataStateContext: this.updateDataStateContext,
          getCollections: this.getCollections
        }}
      >
        {/* <ToastContainer
          enableMultiContainer
          containerId="B"
          position={toast.POSITION.TOP_RIGHT}
        /> */}

        <ToastContainer containerId="C" position="bottom-right" />

        {children}
      </DataContext.Provider>
    );
  }
}

export const DataConsumer = DataContext.Consumer;
