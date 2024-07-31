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
async function main(contactId,user,phone,email,status,organization,role) {

    try {
       //const contract = await getContractInstance();
       const contract = getNetwork().getContract('collaborationcontract');
        console.log('Submit Contact creation transaction.');
       // contactId,user,phone,email,status,organization,role
        const contactBuffer = await contract.submitTransaction("createContact",contactId,user,phone,email,status,organization,role);
        //const contactBuffer = await contract.submitTransaction("createContact","100002", "user 2", "+65 22222222","user2@org1.com","online","org1","treasurer");
        let newContact = JSON.parse(contactBuffer.toString());
        console.log(`${newContact.contactId}  successfully created`);
        console.log('Transaction complete.');
        return newContact;
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


//main("100002", "user 2", "+65 22222222","user2@org1.com","online","org1","treasurer" ).then(() => {
//main("100003", "user 3", "+65 33333333","user3@org1.com","online","org1","manager" ).then(() => {
//main("100006", "user 4", "+65 44444444","user4@org1.com","online","org1","manager" ).then(() => {
//main("100005", "user 5", "+65 44444444","user5@org1.com","online","org1","manager" ).then(() => {
main("100001", "user 1", "+65 11223344","user1@org1.com","online","org1","manager" ).then(() => {

    console.log('Contact created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});