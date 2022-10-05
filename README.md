# Hyperledger Fabric - Network Setup & Configuration
Hyperledger Fabric network setup and configuration steps. This is tested on CentOs8/RHEL8 environment

# Pre-requisites
The server/host should have a FQDN and a Static IP address
- Docker
- Docker Compose
- jq (A Jason Command-line parser)
- tree (Bash utility to see the directory structure)
- git
- Hyperledger Fabric 2.2.1 & Fabric CA 1.4.9 - Binaries and docker images
- Couchdb 3.1.1 - docker image

# Pre-requisites on CentOS8/RHEL8 Host - To be executed as root

- Install pre-requisites on CentOS8/RHEL8 host 

```bash
yum update -y
reboot
yum install -y epel-release.noarch
yum install -y yum-utils jq.x86_64 tree.x86_64 git.x86_64
# Or
dnf update -y 
reboot
dnf install -y epel-release.noarch
dnf install -y yum-utils jq.x86_64 tree.x86_64 git.x86_64
```

- Disable firewalld service and remove the podman & buildah packages which will have conflict with docker

```bash
systemctl disable firewalld
yum remove -y podman.x86_64 buildah.x86_64
# Or
dnf remove -y podman.x86_64 buildah.x86_64
```

- Install Docker
Install latest docker CE

```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
# Or
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io
# Enable docker and check status
systemctl enable --now docker
systemctl status docker
```

- Install Docker Compose 

```bash
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

- Create an Application User

```bash
useradd bcuser
usermod -aG docker bcuser
mkdir /app
chown -R bcuser:bcuser /app
```

# Install Hyperledger Fabric - Login as application user 'bcuser' (non-root)
Install Hyperledger Fabric binaries and docker images

```bash
sudo su - bcuser
cd /app
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.9
docker pull couchdb:3.1.1
```

# Network setup & configuration (e.g. mytest-network)
- Clone the repo for the scripts to setup & configure the network

```bash
cd /app
git clone https://github.com/dammsri/hyperledger-fabric.git
# The below mv step is optional as the above said version binaries alredy present in this repo
mv ../fabric-samples/bin/* hyperledger-fabric/bin/
echo "export PATH=\$PATH:/app/hyperledger-fabric/bin" >> ~/.bash_profile
. ~/.bash_profile
```
- Prepare the Organization configuration (network.conf)
    - CAs (TLS, Orderer & Org)
    - Orderer if the Organization hosting and managing Orderer node
    - Peers
    - Network directory and Channel ID etc.,

```
$ tree -L 1 hyperledger-fabric
../hyperledger-fabric/
├── bin
├── config
├── configtx
├── configuration_ref.txt
├── network.conf
├── README.md
├── scripts
└── templates

7 directories, 3 files
$ tree templates
templates
├── ca.cfg
├── ccp-template.json
├── ccp-template.yaml
├── config.cfg
├── configtx.cfg
├── docker-compose-ca.cfg
├── docker-compose-orderer.cfg
├── docker-compose-org.cfg
├── extra_hosts.txt
├── fabric-ca-client.cfg
├── fabric-ca-server.cfg
├── org_configtx.cfg
└── peer.cfg

0 directories, 13 files
$ tree scripts/
scripts/
├── add_new_org.sh
├── ccp-generate.sh
├── clean.sh
├── endorse_new_org.sh
├── hlf_setup.sh
├── network-down.sh
├── network-up.sh
├── new_org_request.sh
├── set_env
├── start_orderer.sh
├── start_peers.sh
└── t.sh

0 directories, 12 files
#------------------------------------------------------------------------------------------------------------

network.conf               # Org's network configuration
templates                  # The templates to generate the Org's network configuration files
scripts/hlf_setup.sh       # To generate the Organization network configuration and prepare the CAs, Identies and MSP
scripts/start_orderer.sh   # To generate genesis block and start the Orderer
scripts/start_peers.sh     # To create the Channel (if it is the first Org), join the channel and start the peers & update anchor peers
scripts/new_org_request.sh # To generate the new Org request to join the network/channel
scripts/add_new_org.sh     # To add the new Org configuration to the network/channel
scripts/endorse_new_org.sh # To endorse the new Org configuration joining request
scripts/set_env            # To set the environment to interact with the network
scripts/network-up.sh      # To Start the Network (if already setup)
scripts/network-down.sh    # To stop the Network
scripts/clean.sh           # To remove the Network
```

- Once the configuration is ready (netowrk.conf), Setup the network for Org1
Run the scripts/hlf_setup.sh to prepare the network configuration

```bash
cd /app/hyperledger-fabric
sh scripts/hlf_setup.sh
```

- First Organization's configuration is ready and do the same setup for Second Organization configuration. You need at least 2 Organizations to form Networm consortium
- Second Organization needs to share it's MSP to the first Organization to setup the network/channel.
- Place the Second Org's MSP (e.g Org2MSP) into Org2 directory (Please create Org2 dir)

```
$ tree -L 1 mytest-network/organizations/peerOrganizations/
mytest-network/organizations/peerOrganizations/
├── Org1
└── Org2

2 directories, 0 files
$ tree -L 2 Org1/msp/
Org1/msp/
├── cacerts
│   ├── cacert.pem
│   └── hlf-node1-7056.pem
├── config.yaml
└── tlscacerts
    ├── tls-cacert.pem
    └── tls-hlf-node1-7054.pem

2 directories, 5 files
$ tree -L 2 Org2/msp/
Org2/msp/
├── cacerts
│   ├── cacert.pem
│   └── hlf-node2-7056.pem
├── config.yaml
└── tlscacerts
    ├── tls-cacert.pem
    └── tls-hlf-node2-7054.pem

2 directories, 5 files
```

- Run the Orderer setup to create the genesis block (Org1)

```bash
sh scripts/start_orderer.sh
```

- Start the Peers for Org1

```bash
sh scripts/start_peers.sh
```

- Share the first Organization's Orderer MSP to Second Organization (to be place in the same location at Second Organization)

```
$ tree ordererOrganizations/Org1/msp/
ordererOrganizations/Org1/msp/
├── cacerts
│   ├── cacert.pem
│   └── hlf-node1-7055.pem
├── config.yaml
└── tlscacerts
    ├── tls-cacert.pem
    └── tls-hlf-node1-7054.pem

2 directories, 5 files
```

- Second Organization to start the Peers (this will join the Second Org to the network)

```bash
scripts/start_peers.sh
```
### Note: Network is formed with 2 Organizations and ready.

## Join the Third Organization to the Network (3rd or 4th etc.,)

- Prepare the network configuration and setup.

```bash
sh scripts/hlf_setup.sh
```

- Generate Network Joining request (The request file Org3.json will be generated in the channel-artifacts) and share the request file to First Organization who is managing the Orderer

```bash
sh scripts/new_org_request.sh
```

- First Organization to place the file into same directory channel-artifacts and execute the below. This will update the Channel configuration and generate the .pb file to endorse the request

```bash
sh scripts/add_new_org.sh
```

- Share the .pb file to Second Organization to endorse. Second Org to place the file into channel-artifacts and execute

```bash
sh scripts/endorse_new_org.sh
```

### Note: Now Third Organization configuration is updated in the Network/channel and Third Organization can join the Network

- Third Organization to join the Netowrk and start Peers

```bash
sh scripts/start_peers.sh
```

## Note: This setup is tested with One Orderer running at Org1. 

# Verify the network
To verify the network with the peer and discovery utilities.

```bash
# Set the environment 
. scripts/set_env
peer channel list
peer channel getinfo -c $HLF_NETWORK_CHANNEL_ID
discover --configFile conf.yaml --peerTLSCA $CORE_PEER_TLS_ROOTCERT_FILE --userKey organizations/peerOrganizations/Org1/users/User1\@Org1/msp/keystore/4ab467433c71156308add823b9e509c51496288f797dfb9d913186c7248a961a_sk --userCert organizations/peerOrganizations/Org1/users/User1\@Org1/msp/signcerts/cert.pem --MSP Org1MSP saveConfig
discover --configFile conf.yaml peers --channel $HLF_NETWORK_CHANNEL_ID --server $CORE_PEER_ADDRESS
discover --configFile conf.yaml config --channel $HLF_NETWORK_CHANNEL_ID --server $CORE_PEER_ADDRESS
```

# Deploy Chaincode 
To deploy the chaincode 

```bash
# Set the environment 
. scripts/set_env
peer lifecycle chaincode package kychcaincode.tar.gz --lang node --path ./kycchaincode --label kyc_0
peer lifecycle chaincode install kychcaincode.tar.gz
export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID
peer lifecycle chaincode approveformyorg  --orderer $ORDERER_ADDRESS --ordererTLSHostnameOverride $HLF_ORDR_ID --channelID $HLF_NETWORK_CHANNEL_ID --name kyccontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA
peer lifecycle chaincode checkcommitreadiness --channelID $HLF_NETWORK_CHANNEL_ID --name kyccontract -v 0 --sequence 1
```

