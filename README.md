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
cd /app
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.9
docker pull couchdb:3.1.1
```

# Network setup (e.g. mytest-network)
Clone the repo for the scripts to setup the network

```bash
cd /app
git clone https://github.com/dammsri/hyperledger-fabric.git
# The below step is optional as the above said version binaries alredy present in this repo
mv ../fabric-samples/bin/* hyperledger-fabric/bin/
```

Note: you refer the org-samples for directory structure reference.

# Form network with Org1 & Org2
- update the hlf_vars & templates/extra_hosts.txt files to your Org requirements
- Run the hlf_setup.sh script to create the CAs and the network structure for Org1
- Run the hlf_setup.sh script to create the CAs and the network structure for Org2
- Copy/share the Org2 MSP to Org1 server 
- Run the start_org1.sh to start the Org1
- Run the start_org2.sh to start the Org2

# Add Org3
- update the hlf_vars & templates/extra_hosts.txt files to your Org requirements
- Run the hlf_setup.sh script to create the CAs and the network structure for Org3
- Run add_org_req.sh to generate Org3 request
- Please share this request file to Org1 to update in the network channel
- Run add_org.sh in Org1 server (after placing the Org3 request file in channel-artifacts directory)
- Please share the Chennal pb file to Org2 to endorse
- Run add_org_endorse.sh in Org2 server (after placing the pb file in channel-artifacts directory)
- Then run start_org3.sh to start the Org3 in Org3 server.


Note: Orderer MSP must be shared to all Organizations (Tested with One Orderer running at Org1)

