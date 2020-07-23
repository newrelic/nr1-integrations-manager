/* eslint 
no-console: 0,
no-async-promise-executor: 0,
require-atomic-updates: 0,
no-unused-vars: 0,
react/no-did-update-set-state: 0
*/

import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { NerdGraphQuery } from 'nr1';
import { Icon } from 'semantic-ui-react';
import pkg from '../../../package.json';

const semver = require('semver');

const DataContext = React.createContext();

export const loadingMsg = msg => (
    <>
        <Icon name="spinner" loading />
        {msg}
    </>
);

export const successMsg = msg => (
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
            hasError: false,
            err: null,
            errInfo: null
        };
    }

    componentDidCatch(err, errInfo) {
        this.setState({ hasError: true, err, errInfo });
    }

    async componentDidMount() {
        this.checkVersion();


        if (this.state.accounts.length === 0) {
            toast.error('Unable to load accounts, please check your nerdpack uuid.', {
                autoClose: 10000,
                containerId: 'B'
            });
        }
    }

    updateDataStateContext = (stateData, actions) => {
        return new Promise(resolve => {
            this.setState({ stateData }, () => {
                resolve(true);
            })
        })
    }

    checkVersion = async () => {
        fetch(
            'https://raw.githubusercontent.com/newrelic/nr1-flex-manager/master/package.json'
        )
            .then(response => {
                return response.json();
            })
            .then(repoPackage => {
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
                    updateDataStateContext: this.updateDataStateContext
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