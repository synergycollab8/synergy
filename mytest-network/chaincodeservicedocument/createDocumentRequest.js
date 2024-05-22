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
async function main(doc_hash_code,requestId,doc_name,doc_type) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('documentcc');
        console.log('Submit document contract creation transaction.');
    
        const docRequestBuffer = await contract.submitTransaction("createDocumentRequest",doc_hash_code,requestId,doc_name,doc_type);
        
        let newDocRequest = JSON.parse(docRequestBuffer.toString());
        console.log(`${newDocRequest.doc_hash_code}  successfully created`);
        console.log('Transaction complete.');
        return newDocRequest;
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
    createDocumentRequest: async function(doc_hash_code,requestId,doc_name,doc_type) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('documentcc');
        console.log('Submit document contract creation transaction.');
    
        const docRequestBuffer = await contract.submitTransaction("createDocumentRequest",doc_hash_code,requestId,doc_name,doc_type);
        
        let newDocRequest = JSON.parse(docRequestBuffer.toString());
        console.log(`${newDocRequest.doc_hash_code}  successfully created`);
        console.log('Transaction complete.');
        return newDocRequest;
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


main("doc_hash_code_123", "RequestID_123", "Trade_doc","docx" ).then(() => {

    console.log('DocumentRequest created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
