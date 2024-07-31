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

        //const cert = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org2/users/Admin@Org2/msp/signcerts/cert.pem')).toString();
        //const key = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org2/users/Admin@Org2/msp/keystore/92b01ce875b44692cbfe7f817e1ca2f3f6ae2b77062c67fb6e2861d5a8985a9f_sk')).toString();
        const cert = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org2/users/User1@Org2/msp/signcerts/cert.pem')).toString();
        const key = fs.readFileSync(path.join(process.cwd(), '../organizations/peerOrganizations/Org2/users/User1@Org2/msp/keystore/e5022cef0285c144a075d0004e60c4bed9da6405365d2a5c849dc6e500611f1e_sk')).toString();

        //const identityLabel = 'Admin@Org2';
        const identityLabel = 'User1@Org2';
        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org2MSP',
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

