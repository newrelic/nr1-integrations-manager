export const accountsQuery = `{
    actor {
      accounts {
        id
        name
        reportingEventTypes
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

export const getApiKeys = (accountId) => `{
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

export const createApiKey = (accountId, name, userId) => `mutation {
    apiAccessCreateKeys(keys: {user: {accountId: ${accountId}, name: "${name}", userId: ${userId}}}) {
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

export const deleteApiKey = (keyId) => `mutation {
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
