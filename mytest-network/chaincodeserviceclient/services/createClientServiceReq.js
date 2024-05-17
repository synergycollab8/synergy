/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { getNetwork, disconnect } = require('../util/networkutil');
// Main program function
async function main(requestId,issue_type,product,subject,description) {

    try {
       //const contract = await getContractInstance();
       const contract = getNetwork().getContract('clientservicecontract');
        console.log('Submit Contact creation transaction.');
    
        const clientServiceRequestBuffer = await contract.submitTransaction("createClientServiceRequest",requestId,issue_type,product,subject,description);
        
        let newClientServiceRequest = JSON.parse(clientServiceRequestBuffer.toString());
        console.log(`${newClientServiceRequest.requestId}  successfully created`);
        console.log('Transaction complete.');
        return newClientServiceRequest;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}



main("12345", "Issue", "BG","Subjecton Guarantee","Request for Guarantee product" ).then(() => {

    console.log('ClientServiceRequest created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});