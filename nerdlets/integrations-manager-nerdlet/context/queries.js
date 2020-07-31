export const accountsQuery = `{
    actor {
      accounts {
        id
        name
        reportingEventTypes
      }
    }
  }`;

export const accountLicenseKeyQuery = (accountId) => `{
    actor {
      account(id: ${accountId}) {
        licenseKey
      }
    }
  }`;

export const catalogNerdpacksQuery = `{
    actor {
      nr1Catalog {
        nerdpacks {
          id
          visibility
          metadata {
            repository
            displayName
          }
        }
      }
    }
  }`;

export const getApiKeysQuery = (accountId) => `{
    actor {
      apiAccess {
        keySearch(query: {types: USER, scope: {accountIds: [${accountId}]}}) {
          keys {
            ... on ApiAccessUserKey {
              id
              name
              key
              userId
              type
              accountId
            }
          }
        }
      }
    }
  }`;

export const createApiKeyQuery = (accountId, name, userId) => `mutation {
    apiAccessCreateKeys(keys: {user: {accountId: ${accountId}, name: "${name}", userId: ${userId}, notes: "Created by Integrations Manager"}}) {
      createdKeys {
        id
        key
        name
      }
      errors {
        message
        type
      }
    }
  }`;

export const deleteApiKeyQuery = (keyId) => `mutation {
    apiAccessDeleteKeys(keys: {userKeyIds: ["${keyId}"]}) {
      deletedKeys {
        id
      }
      errors {
        message
        type
      }
    }
  }`;

export const getUserQuery = `{
    actor {
      user {
        id
        email
      }
    }
  }`;
