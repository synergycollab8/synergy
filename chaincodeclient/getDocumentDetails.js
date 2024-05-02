

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { getContractInstance, disconnect } = require('../util/networkutil');
// Main program function
async function main(PathHash) {

  try {
      const contract = await getContractInstance();
      console.log('Submit document retrive transaction.....',PathHash);
      const docBuffer = await contract.evaluateTransaction("getDocHashDetails",PathHash);
      let docDetails = JSON.parse(docBuffer);
      console.log("document info: ",docDetails);
      return docDetails;

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
///PathHash, CustomerId, createdBy, lastModifiedBy, docType, docExt
/*  main("JHDFKJSDFNSMDNFKQ").then(() => {

  console.log('Contact created successfully.');

}).catch((e) => {

  console.log('Issue program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

});   */
