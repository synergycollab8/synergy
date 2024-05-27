#!/bin/bash

_scripts_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
. $_scripts_dir/set_env
. $_scripts_dir/helper_utils
. $_scripts_dir/hlf_utils

#echo $ORG_NAME

#parse_peer_connection_parameters 1 2 3
#echo $PEER_CONN_PARMS
#echo $PEERS

create_channel() {
  _channel_id=$1
  _channel_tx_file=$2
  _channel_block_file=${3:-$(dirname $_channel_tx_file)/"${_channel_id}.block"}
  echo $_channel_block_file
}
create_channel "abc" "/app/xyz.tx" "/dev/def.block"
create_channel "abc" "/app/xyz.tx"
create_channel "abc"

sdir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
echo $sdir
exit 0

wait_for_event 10
(
  sleep 30
  exit 12
) &
p=$!
echo $p
wait_for_process $p
wait -n $p
res=$?
echo $res

banner() {
  max_len=0
  for n in "$@"; do [[ ${#n} -gt $max_len ]] && { max_len=${#n}; }; done
  echo -ne "+"
  for n in $(seq 1 $((max_len + 2))); do echo -ne "-"; done
  echo -ne "+\n"
  printf "| %-${max_len}s |\n" "$(date)"
  printf "| %-${max_len}s |\n" " "
  printf "|$(tput bold) %-${max_len}s $(tput sgr0)|\n" "$@"
  echo -ne "+"
  for n in $(seq 1 $((max_len + 2))); do echo -ne "-"; done
  echo -ne "+\n"
}

#banner "Package chaincode is testing for the line length" "another one" "one more" 1234
