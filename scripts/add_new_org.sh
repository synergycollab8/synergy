#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

. $(dirname $0)/set_env "$@"

cd $HLF_NETWORK_DIR

########################################
# ADD ORG
########################################

while [ -z "${_new_org_id}" ]; do
    read -p "Enter New Org ID: " _new_org_id
done
[[ ! -f ./channel-artifacts/${_new_org_id}.json ]] && { echo "Required File ./channel-artifacts/${_new_org_id}.json Not Found. Exiting..."; exit 1; }

peer channel fetch config ./channel-artifacts/config_block.pb -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID -c ${HLF_NETWORK_CHANNEL_ID} --tls --cafile $ORDERER_CA

configtxlator proto_decode --input ./channel-artifacts/config_block.pb --type common.Block | jq .data.data[0].payload.data.config > ./channel-artifacts/${_new_org_id}MSPconfig.json
#jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"${_new_org_id}MSP":.[1]}}}}}' ./channel-artifacts/${_new_org_id}MSPconfig.json $HLF_NETWORK_DIR/channel-artifacts/${_new_org_id}.json > ./channel-artifacts/${_new_org_id}MSPmodified_config.json
#jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org3MSP":.[1]}}}}}' ./channel-artifacts/${_new_org_id}MSPconfig.json $HLF_NETWORK_DIR/channel-artifacts/${_new_org_id}.json > ./channel-artifacts/${_new_org_id}MSPmodified_config.json
jq -s ".[0] * {\"channel_group\":{\"groups\":{\"Application\":{\"groups\": {\"${_new_org_id}MSP\":.[1]}}}}}" ./channel-artifacts/${_new_org_id}MSPconfig.json $HLF_NETWORK_DIR/channel-artifacts/${_new_org_id}.json > ./channel-artifacts/${_new_org_id}MSPmodified_config.json
configtxlator proto_encode --input ./channel-artifacts/${_new_org_id}MSPconfig.json --type common.Config --output ./channel-artifacts/${_new_org_id}MSPconfig.pb
configtxlator proto_encode --input ./channel-artifacts/${_new_org_id}MSPmodified_config.json --type common.Config --output ./channel-artifacts/${_new_org_id}MSPmodified_config.pb
configtxlator compute_update --channel_id "${HLF_NETWORK_CHANNEL_ID}" --original ./channel-artifacts/${_new_org_id}MSPconfig.pb --updated ./channel-artifacts/${_new_org_id}MSPmodified_config.pb --output ./channel-artifacts/${_new_org_id}MSPconfig_update.pb
configtxlator proto_decode --input ./channel-artifacts/${_new_org_id}MSPconfig_update.pb --type common.ConfigUpdate --output ./channel-artifacts/${_new_org_id}MSPconfig_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'${HLF_NETWORK_CHANNEL_ID}'", "type":2}},"data":{"config_update":'$(cat ./channel-artifacts/${_new_org_id}MSPconfig_update.json)'}}}' | jq . > ./channel-artifacts/${_new_org_id}_update_in_envelope.json
configtxlator proto_encode --input ./channel-artifacts/${_new_org_id}_update_in_envelope.json --type common.Envelope --output ./channel-artifacts/${_new_org_id}_update_in_envelope.pb

peer channel signconfigtx -f ./channel-artifacts/${_new_org_id}_update_in_envelope.pb

echo "------ Please submit $HLF_NETWORK_DIR/channel-artifacts/${_new_org_id}_update_in_envelope.pb to Org2 to approve -------"

