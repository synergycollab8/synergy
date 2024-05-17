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
async function main(contactId) {
    console.log("contactId .......",contactId);
    try {
        //const contract = await getContractInstance();
        const contract = getNetwork().getContract('collaborationcontract');
        const contactBuffer = await contract.submitTransaction("getContact",contactId);
        let contact = JSON.parse(contactBuffer.toString());
        console.log(`${contact.contactId} contact user: ${contact.user}${contact.email} ${contact.phone} ${contact.role}  ${contact.status} ${contact.organization} retrieved successfully`);
        return contact;
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


main("100005").then(() => {

    console.log('Contact retrieve successfully');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
