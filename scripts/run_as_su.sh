#!/bin/bash

### Dammavalam, Srirangam
### 16-MAY-2024

dnf update -y 
reboot

dnf install -y epel-release.noarch
dnf install -y yum-utils jq.x86_64 tree.x86_64 git.x86_64

systemctl disable firewalld
dnf remove -y podman.x86_64 buildah.x86_64

dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io
# Enable docker and check status
systemctl enable --now docker
systemctl status docker

curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

useradd bcuser
usermod -aG docker bcuser
mkdir /app
chown -R bcuser:bcuser /app

sudo dnf module list nodejs
sudo dnf module enable nodejs:18         # Press 'y' when prompted
sudo dnf install nodejs                  # Press 'y' when prompted
node --version
npm --version

## App User ---------------------------------------
sudo su - bcuser
cd /app
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.9
docker pull couchdb:3.1.1

cd /app
git clone https://github.com/dammsri/hyperledger-fabric.git
# The below mv step is optional as the above said version binaries alredy present in this repo
mv ../fabric-samples/bin/* hyperledger-fabric/bin/
echo "export PATH=\$PATH:/app/hyperledger-fabric/bin" >> ~/.bash_profile
. ~/.bash_profile
