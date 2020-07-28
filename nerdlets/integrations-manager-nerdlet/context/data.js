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
import {
  accountsQuery,
  catalogNerdpacksQuery,
  getApiKeysQuery,
  getUserQuery
} from './queries';
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
      pkgName: 'nr1-flex-manager', // when name transitioned update this
      selectedPage: 'home',
      selectedAccount: null,
      selectedCollection: null,
      selectedApiKey: null,
      accounts: [],
      collections: [],
      reportingEntities: [],
      hasError: false,
      err: null,
      errInfo: null,
      uuid: null,
      apiKeys: [],
      userData: null,
      productIntegrations: [],
      flexIntegrations: []
    };
  }

  async componentDidMount() {
    await this.checkVersion();
    this.getNerdpackUuid();
    this.getUser();
    this.getProductIntegrations();
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

  // temporary function to help with repo name transition
  getDetermineActiveRepo = () => {
    return new Promise((resolve) => {
      fetch;
    });
  };

  getProductIntegrations = () => {
    const { pkgName } = this.state;
    const url = `https://raw.githubusercontent.com/newrelic/${pkgName}/master/integrations/product.json`;

    fetch(url)
      .then((response) => response.json())
      .then((productIntegrations) => this.setState({ productIntegrations }));
  };

  getNerdpackUuid = async () => {
    // check if manually deployed nerdpack
    let nerdpackUUID = '';
    try {
      nerdpackUUID = window.location.href
        .split('.com/launcher/')[1]
        .split('.')[0];
    } catch (e) {
      // console.log(`nerdpack not manually deployed${e}`);
    }

    // check if nerdpack running locally
    if (nerdpackUUID === '') {
      try {
        nerdpackUUID = window.location.href.split('https://')[1].split('.')[0];
      } catch (e) {
        // console.log(`nerdpack not running locally`);
      }
    }

    // check if nerdpack is running from app catalog
    if (nerdpackUUID === '') {
      await NerdGraphQuery.query({
        query: gql`
          ${catalogNerdpacksQuery}
        `
      }).then((value) => {
        const nerdpacks = (
          ((((value || {}).data || {}).actor || {}).nr1Catalog || {})
            .nerdpacks || []
        ).filter(
          (n) =>
            n.visibility === 'GLOBAL' &&
            n.metadata.repository &&
            (n.metadata.repository.includes('nr1-flex-manager') ||
              n.metadata.repository.includes('nr1-integrations-manager'))
        );

        if (nerdpacks.length > 0) {
          nerdpackUUID = nerdpacks[0].id;
        }
      });
    }

    if (nerdpackUUID) {
      this.setState({ uuid: nerdpackUUID });
    }
  };

  getUser = () => {
    NerdGraphQuery.query({
      query: gql`
        ${getUserQuery}
      `
    }).then((value) => {
      const userData = (((value || {}).data || {}).actor || {}).user || null;
      this.setState({ userData });
    });
  };

  getAccounts = () => {
    return new Promise((resolve) => {
      toast.info(loadingMsg('Fetching accounts...'), {
        toastId: 'fetchingAccounts',
        autoClose: 5000,
        containerId: 'C'
      });

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

        this.setState({ accounts }, () => {
          toast.dismiss('fetchingAccounts');
          resolve(true);
        });
      });
    });
  };

  getApiKeys = (accountId) => {
    NerdGraphQuery.query({
      query: gql`
        ${getApiKeysQuery(accountId)}
      `
    }).then((values) => {
      let apiKeys = (
        (
          ((((values || {}).data || {}).actor || {}).apiAccess || {})
            .keySearch || {}
        ).keys || []
      )
        .filter((k) => !k.key.includes('...'))
        .map((a) => ({
          key: a.id,
          value: a.key,
          label: `${a.name} - ${a.key.slice(0, 8)}...`,
          text: `${a.name} - ${a.key.slice(0, 8)}...`
        }));

      this.setState({ apiKeys });
    });
  };

  getCollections = async (accountId) => {
    toast.info(loadingMsg('Fetching collections...'), {
      toastId: 'fetchingCollections',
      autoClose: 5000,
      containerId: 'C'
    });

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

      const collections = (collectionsIndex || []).map((c) => ({
        key: `${c}:::${accountId}`,
        value: c,
        label: c,
        text: c,
        accountId
      }));

      reportingEntities.forEach((r) => {
        // avoid duplicates
        let collectionExists = existsInArray(
          collections,
          `${r.collection}:::${r.collectionAccountId}`,
          'key'
        );

        if (!collectionExists) {
          collections.push({
            key: `${r.collection}:::${r.collectionAccountId}`,
            value: r.collection,
            label: r.collection,
            text: r.collection,
            collectionAccountId: r.collectionAccountId,
            accountId
          });
        }
      });

      this.setState(
        { collections, reportingEntities, collectionsIndex },
        () => {
          toast.update('fetchingCollections', {
            autoClose: 2000,
            containerId: 'C',
            type: 'success',
            render: successMsg('Collections fetched.')
          });
        }
      );
    });
  };

  updateDataStateContext = (stateData, actions) => {
    return new Promise((resolve) => {
      this.setState(stateData, () => {
        resolve(true);
      });
    });
  };

  checkVersion = () => {
    return new Promise(async (resolve) => {
      let pkgName = '';

      // dual check temporary till transition
      let data = await fetch(
        'https://raw.githubusercontent.com/newrelic/nr1-integrations-manager/master/package.json'
      ).then((response) => {
        if (response.ok) {
          pkgName = 'nr1-integrations-manager';
          return response.json();
        }
        return null;
      });

      if (!data) {
        data = await fetch(
          'https://raw.githubusercontent.com/newrelic/nr1-flex-manager/master/package.json'
        ).then((response) => {
          if (response.ok) {
            pkgName = 'nr1-flex-manager';
            return response.json();
          }
          return null;
        });
      }

      if (data) {
        console.log(`current name: ${pkgName}`);
        if (pkg.version === data.version) {
          console.log(`Running latest version: ${pkg.version}`);
        } else if (semver.lt(pkg.version, data.version)) {
          toast.warn(
            <a
              onClick={() =>
                window.open(`https://github.com/newrelic/${pkgName}/`, '_blank')
              }
            >{`New version available: ${data.version}`}</a>,
            {
              autoClose: 5000,
              containerId: 'C'
            }
          );
        }
      }

      this.setState({ pkgName }, () => {
        resolve();
      });

      //   .then((repoPackage) => {
      //     if (pkg.version === repoPackage.version) {
      //       console.log(`Running latest version: ${pkg.version}`);
      //     } else if (semver.lt(pkg.version, repoPackage.version)) {
      //       toast.warn(
      //         <a
      //           onClick={() =>
      //             window.open(
      //               'https://github.com/newrelic/nr1-flex-manager/',
      //               '_blank'
      //             )
      //           }
      //         >{`New version available: ${repoPackage.version}`}</a>,
      //         {
      //           autoClose: 5000,
      //           containerId: 'C'
      //         }
      //       );
      //     }
      //   });
    });
  };

  render() {
    const { children } = this.props;

    return (
      <DataContext.Provider
        value={{
          ...this.state,
          updateDataStateContext: this.updateDataStateContext,
          getCollections: this.getCollections,
          getApiKeys: this.getApiKeys
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
