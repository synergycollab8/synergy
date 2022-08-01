#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

. $(dirname $0)/set_env "$@"

HLF_TEMPLATE_DIR=$HLF_HOME/templates
cd $HLF_NETWORK_DIR

########################################
# ADD ORG
########################################

eval "cat <<EOF
$(cat $HLF_TEMPLATE_DIR/org_configtx.cfg)
EOF
" > $HLF_NETWORK_DIR/configtx/configtx.yaml

export FABRIC_CFG_PATH=${HLF_HOME}/config/

configtxgen -configPath ./configtx -printOrg ${ORG_MSPID} > $HLF_NETWORK_DIR/organizations/peerOrganizations/$ORG_NAME/${ORG_NAME}.json

echo "------- Please submit the file: $HLF_NETWORK_DIR/organizations/peerOrganizations/$ORG_NAME/${ORG_NAME}.json to Org1 to update channel config --------"

