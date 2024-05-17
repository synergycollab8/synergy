/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');

const { getNetwork, disconnect } = require('../util/networkutil');
// Main program function
async function main(requestId) {
    console.log("RequestID .......",requestId);
    try {
        //const contract = await getContractInstance();
        
        const contract = getNetwork().getContract('collaborationcontract');
        const clientServiceRequestBuffer = await contract.submitTransaction("getClientServiceRequest",requestId);
        let clientServiceRequest = JSON.parse(clientServiceRequestBuffer.toString());
        console.log(`${clientServiceRequest.requestId} contact user: ${clientServiceRequest.issue_type}${clientServiceRequest.product} ${clientServiceRequest.subject} ${clientServiceRequest.description}  retrieved successfully`);
        return clientServiceRequest;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}

//module.exports.execute = main;


main("12345").then(() => {

    console.log('ClientServiceRequest retrieve successfully');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
