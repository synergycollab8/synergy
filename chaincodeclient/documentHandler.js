

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { getContractInstance, disconnect } = require('../util/networkutil');
// Main program function
async function main(PathHash, CustomerId, createdBy, lastModifiedBy, docType, docExt) {

  try {

    const contract = await getContractInstance();

      console.log('Submit document creation transaction.');
     // contactId,user,phone,email,status,organization,role
      const docBuffer = await contract.submitTransaction("addDocHash",PathHash, CustomerId, createdBy, lastModifiedBy, docType, docExt);
      let newDoc = JSON.parse(docBuffer.toString());

      console.log(`${newDoc.PathHash}  successfully created`);
      console.log('Transaction complete.');
      return newDoc;

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

//PathHash, CustomerId, createdBy, lastModifiedBy, docType, docExt
/* main("OOOOOOO123", "123412312", "user5 ","user 6","KYC","pdf").then(() => {
    //main("100001", "user 1", "+65 11223344","user1@org2.com","online","org2","manager" ).then(() => {
    
        console.log('Contact created successfully.');
    
    }).catch((e) => {
    
        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        process.exit(-1);
    
    }); */
