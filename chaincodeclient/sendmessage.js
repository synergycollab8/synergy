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
async function main(roomId,data,sentby,messageId) {
    console.log("send message ",roomId,data,sentby,messageId);
    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const contract = await getContractInstance();
        console.log('Submit sendmessage creation transaction.');
        const messageBuffer = await contract.submitTransaction("sendMessage",roomId,data,sentby,messageId);
        let newMessage = JSON.parse(messageBuffer.toString());

        console.log(`${newMessage}  successfully sent`);
        console.log('Transaction complete.');
        return newMessage;
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
//roomId,message,sentBy
/* main("9b808338-5c21-48d2-bd8c-66080e39f463", "tring asdfasdf tring", "user 1" ).then(() => {

    console.log('message sent  successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

}); */
