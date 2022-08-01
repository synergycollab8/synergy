#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

. $(dirname $0)/set_env "$@"

export COMPOSE_PROJECT_NAME=net
cd $HLF_NETWORK_DIR

docker_files=" -f docker/docker-compose-ca.yaml -f docker/docker-compose-org.yaml"
if [ "${HLF_CA_ORDR_REQ}" = "Y" ]; then
docker_files="$docker_files -f docker/docker-compose-orderer.yaml"
fi

docker-compose $docker_files down

docker volume prune -f

echo "--------- C L E A R E D -------------"

