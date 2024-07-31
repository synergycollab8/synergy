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
const path = require('path');
const { getNetworkInstance, disconnect } = require('./util/networkutil');
// Main program function
async function main(doc_hash_code) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('documentcc');
        console.log('Submit get document creation details.');
    
        const documentRequestBuffer = await contract.submitTransaction("getDocumentRequest",doc_hash_code);
        
        let newDocumentServiceRequest = JSON.parse(documentRequestBuffer.toString());
        console.log(`${newDocumentServiceRequest.requestId}  successfully retrieved`);
        console.log('Transaction complete.');
        return newDocumentServiceRequest;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}

module.exports = {
    getDocumentServiceRequestdata: async function (doc_hash_code) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('documentcc');
        console.log('Submit get document creation details.');
    
        const documentRequestBuffer = await contract.submitTransaction("getDocumentRequest",doc_hash_code);
        
        let newDocumentServiceRequest = JSON.parse(documentRequestBuffer.toString());
        console.log(`${newDocumentServiceRequest.requestId}  successfully retrieved`);
        console.log('Transaction complete.');
        return newDocumentServiceRequest;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        return error.subject;
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}
}

module.exports = {
    getAllData: async function () {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('documentcc');
        console.log('Submit retrieve all document request details  transaction.');
    
        const documentServiceRequestBuffer = await contract.submitTransaction("queryAllData");
        
        let newDocumentServiceRequest = JSON.parse(documentServiceRequestBuffer.toString());
        console.log(`${newDocumentServiceRequest}  successfully retrieved`);
        console.log('Transaction complete.');
        return newDocumentServiceRequest;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        return error.subject;
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}

}


main("9000" ).then(() => {

    console.log('Document retrieved successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
