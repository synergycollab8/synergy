#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

_scripts_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
. $_scripts_dir/set_env
. $_scripts_dir/helper_utils

cd $HLF_NETWORK_DIR

########################################
# Start Orderer
########################################
print_header ">>>>> Starting Orderer >>>>>"

if [ "${HLF_CA_ORDR_REQ}" = "Y" ]; then
    configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block -configPath ./configtx
    configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.tx -channelID ${HLF_NETWORK_CHANNEL_ID} -configPath ./configtx
    wait_for_seconds 30
    export COMPOSE_PROJECT_NAME=net
    docker-compose -f docker/docker-compose-orderer.yaml up -d
    wait_for_seconds 60
    successln "----------- ORDERER >>>> S T A R T E D >>> ----------"
else
    warnln "----------- NO ORDERER >>>> C O N F I G U R E D >>> ----------"
fi
