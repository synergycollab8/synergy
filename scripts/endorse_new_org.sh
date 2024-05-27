#!/bin/bash

### Dammavalam, Srirangam
### 01-JUN-2021

_scripts_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
. $_scripts_dir/set_env
. $_scripts_dir/helper_utils
. $_scripts_dir/hlf_utils

cd $HLF_NETWORK_DIR

########################################
# ADD ORG
########################################

_org_n=$(echo $ORG_NAME | sed -n 's/^Org\([0-9]*\).*$/\1/p')

while [ -z "${_new_org_request_file}" ]; do
    read -p "Enter New Org request file : " _new_org_request_file
done

test ! -f $_new_org_request_file && fatalln "New Org request file '$_new_org_request_file' Not found"

print_header ">>> Endorse New Org >>>" "Request File: $_new_org_request_file"

update_channel_config $_org_n $HLF_NETWORK_CHANNEL_ID $_new_org_request_file

successln "------------ C H A N N E L >>> U P D A T E D --------------"
