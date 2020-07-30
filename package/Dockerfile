FROM newrelic/infrastructure-bundle:latest

COPY ./nri-sync /var/db/newrelic-infra/newrelic-integrations/bin/
COPY ./nri-sync-docker-config.yml /etc/newrelic-infra/integrations.d/

ENV NRIA_PASSTHROUGH_ENVIRONMENT="NR_UUID,NR_API_KEY,NR_ACCOUNT_ID,NR_COLLECTION"