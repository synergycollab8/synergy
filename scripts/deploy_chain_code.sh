#!/bin/bash

### Dammavalam, Srirangam
### 06-MAY-2024

_scripts_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
#. $_scripts_dir/set_env
. $_scripts_dir/helper_utils
. $_scripts_dir/hlf_utils

CHANNEL_NAME=mytestchannel
CC_NAME=${1}
CC_PATH=${2}
CC_VERSION=${3:-"1.0"}
CC_SEQUENCE=${4:-"1"}
CC_LANGUAGE="node"
CC_PACKAGE_PATH=${5:-"/app/hyperledger-fabric/chaincode"}
CC_INIT_FCN=${6:-"NA"}
CC_END_POLICY=${7:-"NA"}
CC_COLL_CONFIG=${8:-"NA"}
DELAY=${9:-"5"}
MAX_RETRY=${10:-"5"}
VERBOSE=${11:-"false"}

TEMP_LOG="log.txt"

println "=====> Executing with the following <====="
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_PATH: ${C_GREEN}${CC_PATH}${C_RESET}"
println "- CC_LANGUAGE: ${C_GREEN}${CC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- CC_PACKAGE_PATH: ${C_GREEN}${CC_PACKAGE_PATH}${C_RESET}"
println "- CC_END_POLICY: ${C_GREEN}${CC_END_POLICY}${C_RESET}"
println "- CC_COLL_CONFIG: ${C_GREEN}${CC_COLL_CONFIG}${C_RESET}"
println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"

#print_header "Executing script with the following parameters" "- CHANNEL_NAME: ${CHANNEL_NAME}" "- CC_NAME: ${CC_NAME}" "- CC_PATH: ${CC_PATH}" "- CC_PACKAGE_PATH: ${CC_PACKAGE_PATH}" "- CC_LANGUAGE: ${CC_LANGUAGE}" "- CC_VERSION: ${CC_VERSION}" "- CC_SEQUENCE: ${CC_SEQUENCE}" "- CC_END_POLICY: ${CC_END_POLICY}" "- CC_COLL_CONFIG: ${CC_COLL_CONFIG}" "- CC_INIT_FCN: ${CC_INIT_FCN}" "- DELAY: ${DELAY}" "- MAX_RETRY: ${MAX_RETRY}" "- VERBOSE: ${VERBOSE}"

#Check pre reqs
print_header "Checking pre-requisites"
check_pre_reqs

#Check the CC_VERSION
if [ "$(echo "$CC_VERSION" | sed 's/\.//g')" == "$CC_VERSION" ]; then
  fatalln "Received chaincode version: '$CC_VERSION' doesn't contain minor version. e.g. n.n or n.n.n (<major>.<minor> [OR] <major>.<minor>.<hotfix>)"
fi

#User has not provided a name
if [ -z "$CC_NAME" ] || [ "$CC_NAME" = "NA" ]; then
  fatalln "No chaincode name was provided."

# User has not provided a path
elif [ -z "$CC_PATH" ] || [ "$CC_PATH" = "NA" ]; then
  fatalln "No chaincode path was provided."

# User has not provided a language
elif [ -z "$CC_LANGUAGE" ] || [ "$CC_LANGUAGE" = "NA" ]; then
  fatalln "No chaincode language was provided."

## Make sure that the path to the chaincode exists
elif [ ! -d "$CC_PATH" ]; then
  fatalln "Path to chaincode does not exist. Please provide valid path."
fi

CC_LANGUAGE=$(echo "$CC_LANGUAGE" | tr [:upper:] [:lower:])

if [ "$CC_LANGUAGE" != "node" ]; then
  fatalln "The chaincode language ${CC_LANGUAGE} is not supported by this script. Supported chaincode language is: node"
  exit 1
fi

INIT_REQUIRED="--init-required"
# check if the init fcn should be called
if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=""
fi

if [ "$CC_END_POLICY" = "NA" ]; then
  CC_END_POLICY=""
else
  CC_END_POLICY="--signature-policy $CC_END_POLICY"
fi

if [ "$CC_COLL_CONFIG" = "NA" ]; then
  CC_COLL_CONFIG=""
else
  CC_COLL_CONFIG="--collections-config $CC_COLL_CONFIG"
fi

if [ ! -d "$CC_PACKAGE_PATH" ]; then mkdir -p $CC_PACKAGE_PATH; fi

package_chain_code() {
  set -x
  peer lifecycle chaincode package $CC_PACKAGE_PATH/${CC_NAME}.tar.gz --path ${CC_PATH} --lang ${CC_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  verify_result $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

# install_chain_code PEER ORG
install_chain_code() {
  ORG=$1
  PEER=$2
  set_org_env $ORG $PEER
  infoln "Installing chaincode on ${PEER_ID} ..."
  set -x
  peer lifecycle chaincode install $CC_PACKAGE_PATH/${CC_NAME}.tar.gz >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  verify_result $res "Chaincode installation on ${PEER_ID} has failed"
  successln "Chaincode is installed on ${PEER_ID}"
}

# query_installed PEER ORG
query_installed() {
  ORG=$1
  PEER=$2
  set_org_env $ORG $PEER
  infoln "Query installed on ${PEER_ID} ..."
  set -x
  peer lifecycle chaincode queryinstalled >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" ${TEMP_LOG})
  verify_result $res "Query installed on ${PEER_ID} has failed"
  successln "Query installed successful on ${PEER_ID} on channel"
}

# approve_for_my_org VERSION PEER ORG
approve_for_my_org() {
  ORG=$1
  set_org_env $ORG
  infoln "Approve chaincode for ${ORG_NAME} on ${PEER_ID} ..."
  set -x
  peer lifecycle chaincode approveformyorg --orderer $ORDERER_ADDRESS --ordererTLSHostnameOverride $HLF_ORDR_ID --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  verify_result $res "Chaincode definition approved on ${PEER_ID} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition approved on ${PEER_ID} on channel '$CHANNEL_NAME'"
}

# check_commit_readiness VERSION PEER ORG
check_commit_readiness() {
  ORG=$1
  shift 1
  PEER=$1
  shift 1
  set_org_env $ORG $PEER
  infoln "Checking the commit readiness of the chaincode definition on ${PEER_ID} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    wait_for_seconds $DELAY
    infoln "Attempting to check the commit readiness of the chaincode definition on ${PEER_ID}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} --output json >&${TEMP_LOG} &
    { set +x; } 2>/dev/null
    _mypid=$!
    wait_for_process $_mypid
    wait $_mypid
    res=$?
    infoln "Received response code: $res"
    let rc=0
    for var in "$@"; do
      grep "$var" ${TEMP_LOG} &>/dev/null || let rc=1
    done
    COUNTER=$(expr $COUNTER + 1)
  done
  cat ${TEMP_LOG}
  if test $rc -eq 0; then
    infoln "Checking the commit readiness of the chaincode definition successful on ${PEER_ID} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Check commit readiness result on ${PEER_ID} is INVALID!"
  fi
}

# commit_chain_code_definition VERSION PEER ORG (PEER ORG)...
commit_chain_code_definition() {
  parse_peer_connection_parameters $@
  res=$?
  verify_result $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  infoln "Commit chaincode ${CC_NAME} on channel '$CHANNEL_NAME' ..."
  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit --orderer $ORDERER_ADDRESS --ordererTLSHostnameOverride $HLF_ORDR_ID --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} $PEER_CONN_PARMS --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  verify_result $res "Chaincode definition commit failed on ${PEER_ID} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition committed on channel '$CHANNEL_NAME'"
}

# query_committed ORG
query_committed() {
  ORG=$1
  PEER=$2
  set_org_env $ORG $PEER
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  infoln "Query chaincode definition on ${PEER_ID} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    wait_for_seconds $DELAY
    infoln "Attempting to Query committed status on ${PEER_ID}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&${TEMP_LOG} &
    { set +x; } 2>/dev/null
    _mypid=$!
    wait_for_process $_mypid
    wait $_mypid
    res=$?
    infoln "Received response code: $res"
    test $res -eq 0 && VALUE=$(cat ${TEMP_LOG} | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
    COUNTER=$(expr $COUNTER + 1)
  done
  cat ${TEMP_LOG}
  if test $rc -eq 0; then
    successln "Query chaincode definition successful on ${PEER_ID} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query chaincode definition result on ${PEER_ID} is INVALID!"
  fi
}

# Get the current chaincode version and sequence from the channel
get_chaincode_ver_seq() {
  ORG=$1
  PEER=$2
  _new_cc_str="status: 404"
  set_org_env $ORG $PEER
  infoln "Query chaincode definition on ${PEER_ID} on channel '$CHANNEL_NAME'..."
  set -x
  peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  if [ $res -eq 0 ]; then
    CUR_CC_VERSION=$(sed -n 's/^.*Version: \([0-9\.]*\).*$/\1/p' ${TEMP_LOG})
    CUR_CC_SEQUENCE=$(sed -n 's/^.*Sequence: \([0-9]*\).*$/\1/p' ${TEMP_LOG})
    successln "Query chaincode definition successful on ${PEER_ID} on channel '$CHANNEL_NAME'"
  elif [ "$(grep -o "$_new_cc_str" ${TEMP_LOG})" = "$_new_cc_str" ]; then
    warnln "No chaincode found for CC_NAME: $CC_NAME on ${PEER_ID} on channel '$CHANNEL_NAME'"
    NEW_CC=Y
  else
    fatalln "Failed to get the chaincode definition on ${PEER_ID} on channel '$CHANNEL_NAME'"
  fi
}

chain_code_invoke_init() {
  parse_peer_connection_parameters $@
  res=$?
  verify_result $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  fcn_call='{"function":"'${CC_INIT_FCN}'","Args":[]}'
  infoln "invoke fcn call:${fcn_call}"
  set -x
  peer chaincode invoke --orderer $ORDERER_ADDRESS --ordererTLSHostnameOverride $HLF_ORDR_ID --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS --isInit -c ${fcn_call} >&${TEMP_LOG} &
  { set +x; } 2>/dev/null
  _mypid=$!
  wait_for_process $_mypid
  wait $_mypid
  res=$?
  infoln "Received response code: $res"
  cat ${TEMP_LOG}
  verify_result $res "Invoke execution on $PEERS failed "
  successln "Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME'"
}

chaincode_query() {
  ORG=$1
  PEER=$2
  set_org_env $ORG $PEER
  infoln "Querying on ${PEER_ID} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    wait_for_seconds $DELAY
    infoln "Attempting to Query ${PEER_ID}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllCars"]}' >&${TEMP_LOG} &
    { set +x; } 2>/dev/null
    _mypid=$!
    wait_for_process $_mypid
    wait $_mypid
    res=$?
    infoln "Received response code: $res"
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat ${TEMP_LOG}
  if test $rc -eq 0; then
    successln "Query successful on ${PEER_ID} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query result on ${PEERID} is INVALID!"
  fi
}

## ======================================================================

print_header "Starting Chaincode Installation" "CC_NAME: $CC_NAME" "CC_VERSION: ${CC_VERSION}" "CC_SEQ: ${CC_SEQUENCE}" "CHANNEL: ${CHANNEL_NAME}"

## Check current chaincode version and sequence
print_header "Check current installed chaincode version & sequence ..."
installed_cc_check_flag=0
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Query chaincode definition on $ORG_NAME Peers..."
  _peer_num=1
  while [ ${_peer_num} -le ${HLF_ORG_PEERS_COUNT} ]; do
    get_chaincode_ver_seq $_org ${_peer_num}
    if [ "$NEW_CC" = "Y" ]; then
      break
    elif [ "$CUR_CC_VERSION" = "$CC_VERSION" -o "$CUR_CC_SEQUENCE" = "$CC_SEQUENCE" ]; then
      warnln "chaincode Name: $CC_NAME with Version: $CC_VERSION and Sequence: $CC_SEQUENCE is already installed on $PEER_ID for $ORG_NAME"
      installed_cc_check_flag=1
      break
    fi
    let _peer_num=_peer_num+1
  done
  test $installed_cc_check_flag -ne 0 && break
  unset _peer_num
done

if [ $installed_cc_check_flag -ne 0 ]; then
  print_header "Requested chaincode details:" "CC_NAME: $CC_NAME" "CC_VERSION: ${CC_VERSION}" "CC_SEQ: ${CC_SEQUENCE}"
  print_header "Installed chaincode details:" "CC_NAME: $CC_NAME" "CC_VERSION: ${CUR_CC_VERSION}" "CC_SEQ: ${CUR_CC_SEQUENCE}"
  fatalln "Chaincode already installed with given Version or Sequence, please check!!"
fi
print_header "Current installed chaincode details:" "CC_NAME: $CC_NAME" "CC_VERSION: ${CUR_CC_VERSION}" "CC_SEQ: ${CUR_CC_SEQUENCE}"

## Package chaincode
print_header "Package Chaincode"
package_chain_code

## Install chaincode on Org peers
print_header "Install Chaincode"
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Installing chaincode on $ORG_NAME Peers..."
  _peer_num=1
  while [ ${_peer_num} -le ${HLF_ORG_PEERS_COUNT} ]; do
    install_chain_code $_org ${_peer_num}
    let _peer_num=_peer_num+1
  done
  unset _peer_num
done

## query whether the chaincode is installed
print_header "Query Installed Chaincode"
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Query installed chaincode on $ORG_NAME Peers..."
  _peer_num=1
  while [ ${_peer_num} -le ${HLF_ORG_PEERS_COUNT} ]; do
    query_installed $_org ${_peer_num}
    let _peer_num=_peer_num+1
  done
  unset _peer_num
done
infoln "Package ID:  $PACKAGE_ID"
print_header "Installed Chaincode Package ID" "$PACKAGE_ID"

## approve the definition
print_header "Approve Chaincode"
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Approve chaincode for $ORG_NAME ..."
  approve_for_my_org $_org
done

## check whether the chaincode definition is ready to be committed
print_header "Check Chaincode Commit Readiness"
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Check commit readiness on $ORG_NAME Peers..."
  _peer_num=1
  while [ ${_peer_num} -le ${HLF_ORG_PEERS_COUNT} ]; do
    check_commit_readiness $_org ${_peer_num} "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
    let _peer_num=_peer_num+1
  done
  unset _peer_num
done

## now that we know for sure all orgs have approved, commit the definition
print_header "Commit Chaincode"
infoln "======> Commit chaincode definition ..."
commit_chain_code_definition 1 2 3

## query on all orgs to see that the definition committed successfully
print_header "Query Committed Chaincode"
for _org in {1..3}; do
  set_org_env $_org
  infoln "======> Query chaincode definition on $ORG_NAME Peers..."
  _peer_num=1
  while [ ${_peer_num} -le ${HLF_ORG_PEERS_COUNT} ]; do
    query_committed $_org ${_peer_num}
    let _peer_num=_peer_num+1
  done
  unset _peer_num
done

## Invoke the chaincode - this does require that the chaincode have the 'initLedger'
## method defined
print_header "Initialize Chaincode"
if [ "$CC_INIT_FCN" = "NA" ]; then
  infoln "Chaincode initialization is not required"
else
  chain_code_invoke_init 1 2
fi

print_header "Chaincode Installed Successfully" "CC_NAME: $CC_NAME" "CC_VERSION: ${CC_VERSION}" "CC_SEQ: ${CC_SEQUENCE}" "CHANNEL: ${CHANNEL_NAME}"
exit 0
