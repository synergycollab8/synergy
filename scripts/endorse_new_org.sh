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
[[ ! -f ./channel-artifacts/${_new_org_id}_update_in_envelope.pb ]] && { echo "Required File ./channel-artifacts/${_new_org_id}_update_in_envelope.pb Not Found. Exiting..."; exit 1; }

peer channel update -f channel-artifacts/${_new_org_id}_update_in_envelope.pb -c ${HLF_NETWORK_CHANNEL_ID} -o ${HLF_ORDR_HOST}:${HLF_ORDR_PORT} --ordererTLSHostnameOverride $HLF_ORDR_ID --tls --cafile $ORDERER_CA

echo "------------ C H A N N E L >>> U P D A T E D --------------"

