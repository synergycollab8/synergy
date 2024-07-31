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
//const {create,globSource} = require('kubo-rpc-client');
//const {globSource} = require('ipfs');
//const { create, globSource } = require('kubo-rpc-client');
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

module.exports = {

    placeDocumentRequest: async function(doc_hash_code,requestId,doc_name,doc_path) {

    try {
       //const contract = await getContractInstance();

       // console.log(`${newDocRequest.doc_hash_code}  successfully created`);
	console.log(`Document upload request ${doc_hash_code} : ${doc_name} : ${doc_path} : ${requestId}`);
	const { create,globSource } = await import('ipfs');
	const client = await create('http://127.0.0.1:5001');
        console.log('Start document request.');

                //
        for await (const file of client.addAll(globSource(doc_path+doc_name, '**/*'))) {
          console.log(file);
          console.log('Document upload complete.');
          return file;
        }
                //
        //return newDocRequest;
    } catch (error) {
        console.log(`Error processing file upload to IPFS . ${error}`);
        console.log(error.stack);
        return error.subject;
    } finally {

        console.log('Finally block from Document upload to IPFS.');

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
