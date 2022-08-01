#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

. $(dirname $0)/set_env "$@"

cd $HLF_NETWORK_DIR

########################################
# Start Peers
########################################

echo "========>>>> Starting Peers ..."
export COMPOSE_PROJECT_NAME=net
docker-compose -f docker/docker-compose-org.yaml up -d
sleep 60
echo "----- PEERS >>> S T A R T E D -------" 

if [ "${HLF_CHANNEL_CREATOR}" = "Y" ]; then
    echo "========>>>> Creating Channel ${HLF_NETWORK_CHANNEL_ID} ..."
    peer channel create -c ${HLF_NETWORK_CHANNEL_ID} -f ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.tx -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID --outputBlock ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.block --tls --cafile $ORDERER_CA
    sleep 30
    echo "========>>>> Joining Channel ${HLF_NETWORK_CHANNEL_ID} ..."
    peer channel join -b ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.block
else
    peer channel fetch 0 ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.block -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID -c ${HLF_NETWORK_CHANNEL_ID} --tls --cafile $ORDERER_CA
    echo "========>>>> Joining Channel ${HLF_NETWORK_CHANNEL_ID} ..."
    peer channel join -b ./channel-artifacts/${HLF_NETWORK_CHANNEL_ID}.block
fi

echo "========>>>> Setting Anchor Peers ..."
#-----------------------------------
## set anchor peer(s)
#-----------------------------------
get_val() {
   var1=$1
   echo ${!var1} 
}

HLF_ORG_ANCHOR_PEERS=$(echo ${HLF_ORG_ANCHOR_PEERS} | sed 's/,/ /g')
_anchor_peers_list=""
echo $HLF_ORG_ANCHOR_PEERS
for _peer_num_ in ${HLF_ORG_ANCHOR_PEERS}; do
    HLF_ORG_PEER_ID=$(get_val HLF_ORG_PEER${_peer_num_}_ID)
    HLF_ORG_PEER_PORT=$(get_val HLF_ORG_PEER${_peer_num_}_PORT)
    [[ -z "${_anchor_peers_list}" ]] && { _anchor_peers_list="{\"host\": \"${HLF_ORG_PEER_ID}\",\"port\": ${HLF_ORG_PEER_PORT}}"; } || { \
        _anchor_peers_list="$(echo ${_anchor_peers_list}),{\"host\":\"${HLF_ORG_PEER_ID}\",\"port\":${HLF_ORG_PEER_PORT}}"; }
done
unset _peer_num_

echo "=====>>> Anchor Peers: $_anchor_peers_list"
peer channel fetch config ./channel-artifacts/config_block.pb -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID -c ${HLF_NETWORK_CHANNEL_ID} --tls --cafile $ORDERER_CA
configtxlator proto_decode --input ./channel-artifacts/config_block.pb --type common.Block | jq .data.data[0].payload.data.config > ./channel-artifacts/${ORG_MSPID}config.json
jq ".channel_group.groups.Application.groups.${ORG_MSPID}.values += {\"AnchorPeers\":{\"mod_policy\": \"Admins\",\"value\":{\"anchor_peers\": [${_anchor_peers_list}]},\"version\": \"0\"}}" ./channel-artifacts/${ORG_MSPID}config.json > ./channel-artifacts/${ORG_MSPID}modified_config.json
configtxlator proto_encode --input "./channel-artifacts/${ORG_MSPID}config.json" --type common.Config >./channel-artifacts/original_config.pb
configtxlator proto_encode --input "./channel-artifacts/${ORG_MSPID}modified_config.json" --type common.Config >./channel-artifacts/modified_config.pb
configtxlator compute_update --channel_id "${HLF_NETWORK_CHANNEL_ID}" --original ./channel-artifacts/original_config.pb --updated ./channel-artifacts/modified_config.pb >./channel-artifacts/config_update.pb
configtxlator proto_decode --input ./channel-artifacts/config_update.pb --type common.ConfigUpdate >./channel-artifacts/config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'${HLF_NETWORK_CHANNEL_ID}'", "type":2}},"data":{"config_update":'$(cat ./channel-artifacts/config_update.json)'}}}' | jq . >./channel-artifacts/config_update_in_envelope.json
configtxlator proto_encode --input ./channel-artifacts/config_update_in_envelope.json --type common.Envelope >./channel-artifacts/${ORG_MSPID}anchors.tx

peer channel update -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID -c ${HLF_NETWORK_CHANNEL_ID} -f ./channel-artifacts/${ORG_MSPID}anchors.tx --tls --cafile $ORDERER_CA

echo "----------- CHANNEL UPDATE >>> C O M P L E T E D >>> ----------"
