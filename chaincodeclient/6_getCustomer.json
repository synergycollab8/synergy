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
    console.log("clientId .......",clientId);
   
    try {

  
        const contract = await getContractInstance();
        
        console.log("input clientId ",clientId);
        const customerBuffer = await contract.submitTransaction("getCustomer",clientId);
        let customerStaticInfo = JSON.parse(customerBuffer.toString());
        console.log(`${customerStaticInfo.clientId} customer: ${customerStaticInfo.customerInfo} retrieved successfully`);

        const customerCDDScreeningBuffer = await contract.submitTransaction("getCustomer","CDDSCREENING_"+clientId);
        let customerCDDScreening = JSON.parse(customerCDDScreeningBuffer.toString());
        console.log("plain json parse ",customerCDDScreening);
        
        const customerTaxClassificationBuffer = await contract.submitTransaction("getCustomer","TAX_CLASSIFICATION_"+clientId);
        let taxClassification = JSON.parse(customerTaxClassificationBuffer.toString());
        console.log("plain json parse ",taxClassification);

        const customerTaxIdentifierBuffer = await contract.submitTransaction("getCustomer","TAX_IDENTIFIER_"+clientId);
        let taxIdentifier = JSON.parse(customerTaxIdentifierBuffer.toString());
        console.log("plain json parse ",taxIdentifier);

        const customerESRABuffer = await contract.submitTransaction("getCustomer","ESRA_"+clientId);
        let esra = JSON.parse(customerESRABuffer.toString());
        console.log("plain json parse ",esra);
        
        const clientInfo = {
            clientId: clientId,
            staticInfo : customerStaticInfo,
            cddScreening: customerCDDScreening,
            taxClassification: taxClassification,
            taxIdentifier: taxIdentifier,
            esra: esra
        }
        return clientInfo;
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


main("55555555").then(() => {

    console.log('Contact retrieve successfully');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
