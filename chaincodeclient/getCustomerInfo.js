/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { getContractInstance, disconnect } = require('../util/networkutil');

// Main program function
async function main(clientId) {
    
    try {

        const contract = await getContractInstance();
        console.log("input clientId ",clientId);
        const customerBuffer = await contract.submitTransaction("getCustomer",clientId);
        let customerStaticInfo = JSON.parse(customerBuffer.toString());
        console.log(`${customerStaticInfo.clientId} customer: ${customerStaticInfo.customerInfo} retrieved successfully`);

        return customerStaticInfo;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}

module.exports.execute = main;

