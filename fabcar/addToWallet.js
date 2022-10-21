'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        //const cert = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org1/users/Admin@Org1/msp/signcerts/cert.pem')).toString();
        //const key = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org1/users/Admin@Org1/msp/keystore/2e4e783404b2d30e87364fc9c118b390e83509e246f5e757a973a9dd31f20484_sk')).toString();
        const cert = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org1/users/User1@Org1/msp/signcerts/cert.pem')).toString();
        const key = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org1/users/User1@Org1/msp/keystore/3ae3426e2e8fdff38eb35eba4105510bcae1ffeea6e1c1a35e8d539540e5b14f_sk')).toString();

        const identityLabel = 'User1@Org1';
        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(identityLabel, identity);
        console.log(`Successfully added the user ${identityLabel} into the wallet`);

    } catch (error) {
        console.error(`Failed to wallet: ${error}`);
        process.exit(1);
    }
}

main();

