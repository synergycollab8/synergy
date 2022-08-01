#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

. $(dirname $0)/set_env "$@"

cd $HLF_NETWORK_DIR

########################################
# Start Orderer
########################################
echo "=======>>>>> Starting Orderer ..."
if [ "${HLF_CA_ORDR_REQ}" = "Y" ]; then
    configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block -configPath ./configtx
    configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.tx -channelID ${HLF_NETWORK_CHANNEL_ID} -configPath ./configtx
    sleep 30
    export COMPOSE_PROJECT_NAME=net
    docker-compose -f docker/docker-compose-orderer.yaml up -d
    sleep 60
    echo "----------- ORDERER >>>> S T A R T E D >>> ----------"
else
    echo "----------- NO ORDERER >>>> C O N F I G U R E D >>> ----------"
fi

