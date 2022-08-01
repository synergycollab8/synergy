. ./set_env

get_val() {
   var1=$1
   echo ${!var1}
}

eval "cat <<EOF
$(cat $HLF_TEMPLATE_DIR/docker-compose-org.cfg)
EOF
" > $HLF_NETWORK_DIR/docker/docker-compose-org.yaml

HLF_PEER_NUM=1
while [ ${HLF_PEER_NUM} -le ${HLF_ORG_PEERS_COUNT} ]; do
    HLF_ORG_PEER_ID=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_ID)
    echo "  ${HLF_ORG_PEER_ID}:" >> $HLF_NETWORK_DIR/docker/docker-compose-org.yaml
    let HLF_PEER_NUM=HLF_PEER_NUM+1
done
echo -e "\nservices:" >> $HLF_NETWORK_DIR/docker/docker-compose-org.yaml
echo -n "- \\\"centos81:192.168.56.21\\\"\n      "> $HLF_TEMPLATE_DIR/extra_hosts.txt

HLF_PEER_NUM=1
while [ ${HLF_PEER_NUM} -le ${HLF_ORG_PEERS_COUNT} ]; do
    HLF_ORG_PEER_ID=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_ID)
    HLF_ORG_PEER_SECRET=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_SECRET)
    HLF_ORG_PEER_PORT=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_PORT)
    HLF_ORG_PEER_CC_PORT=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_CC_PORT)
    HLF_ORG_PEER_COUCHDB=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_COUCHDB)
    HLF_ORG_PEER_COUCHDB_USER=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_COUCHDB_USER)
    HLF_ORG_PEER_COUCHDB_PASSWD=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_COUCHDB_PASSWD)
    HLF_ORG_PEER_COUCHDB_PORT=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_COUCHDB_PORT)
    HLF_ORG_PEER_DIR=$HLF_ORG_DIR/peers/${HLF_ORG_PEER_ID}
eval "cat <<EOF
$(cat $HLF_TEMPLATE_DIR/peer.cfg)
EOF
" >> $HLF_NETWORK_DIR/docker/docker-compose-org.yaml
    let HLF_PEER_NUM=HLF_PEER_NUM+1
    echo -n "- \\\"${HLF_ORG_PEER_ID}:${HLF_CA_HOST_IP}\\\"\n      ">> $HLF_TEMPLATE_DIR/extra_hosts.txt
done
EXTRA_HOSTS=$(cat $HLF_TEMPLATE_DIR/extra_hosts.txt)
sed -i "s/DOCKER_EXTRA_HOSTS/$EXTRA_HOSTS/g" $HLF_NETWORK_DIR/docker/docker-compose-org.yaml

HLF_ORG_ANCHOR_PEERS=$(echo ${HLF_ORG_ANCHOR_PEERS} | sed 's/,/ /g')
_anchor_peers_list=""
for HLF_PEER_NUM in ${HLF_ORG_ANCHOR_PEERS}; do
    HLF_ORG_PEER_ID=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_ID)
    HLF_ORG_PEER_PORT=$(get_val HLF_ORG_PEER${HLF_PEER_NUM}_PORT)
    [[ -z "${_anchor_peers_list}" ]] && { _anchor_peers_list="{\"host\": \"'${HLF_ORG_PEER_ID}'\",\"port\": '${HLF_ORG_PEER_PORT}'}"; } || { \
        _anchor_peers_list=$(echo ${_anchor_peers_list}, {\"host\": \"\'${HLF_ORG_PEER_ID}\'\",\"port\": \'${HLF_ORG_PEER_PORT}\'}); }
done
echo $_anchor_peers_list
while [ -z "${_new_org_id}" ]; do
    read -p "Enter New Org ID: " _new_org_id
done
echo $_new_org_id

