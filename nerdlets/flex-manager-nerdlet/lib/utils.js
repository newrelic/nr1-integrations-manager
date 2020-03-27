import { NerdGraphQuery } from 'nr1';

// Taken from Lew's nr1-container-explorer https://github.com/newrelic/nr1-container-explorer/
export const accountsWithData = async (eventType) => {
  const gql = `{actor {accounts {name id reportingEventTypes(filter:["${eventType}"])}}}`;
  const result = await NerdGraphQuery.query({ query: gql });
  if (result.errors) {
    console.log(
      "Can't get reporting event types because NRDB is grumpy at NerdGraph.",
      result.errors
    );
    console.log(JSON.stringify(result.errors.slice(0, 5), 0, 2));
    return [];
  }
  return result.data.actor.accounts.filter(
    (a) => a.reportingEventTypes.length > 0
  );
};
