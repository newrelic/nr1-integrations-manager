module.exports = {
  nrql: (accountId, nrql) => {
    return `{
          actor {
            account(id: ${accountId}) {
              nrql(query: "${nrql}", timeout: 30000){
                results
              }
              id
              name
            }
          }
        }`;
  },
  nrqlFlexStatusSummary: (validation) => {
    return `FROM flexStatusSample SELECT * WHERE ${validation} SINCE 120 seconds ago LIMIT 1`;
  },
  nrqlFlexSummary:
    `FROM flexStatusSample SELECT ` +
    `latest(flex.counter.EventCount) as 'flex.EventCount', ` +
    `latest(flex.counter.EventDropCount) as 'flex.EventDropCount', ` +
    `latest(flex.counter.ConfigsProcessed) as 'flex.ConfigsProcessed', ` +
    `latest(flex.IntegrationVersion) as 'flex.IntegrationVersion' ` +
    `FACET flex.ContainerId, flex.Hostname, flex.LambdaName, entityGuid, flex.GitRepo SINCE 5 minutes ago LIMIT 1000`,
};
