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
async function main(room_id,room_name,userId,userName) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('chatcc');
        console.log('Submit Chat Contact creation transaction.');
    
        const chatRequestBuffer = await contract.submitTransaction("createChatRequest",room_id,room_name,userId,userName);
        
        let newChatRequest = JSON.parse(chatRequestBuffer.toString());
        console.log(`${newChatRequest.room_id}  successfully created`);
        console.log('Transaction complete.');
        return newChatRequest;
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
    chatRequestDetails: async function(room_id,room_name,userId,userName) {

    try {
       //const contract = await getContractInstance();
       const network = await getNetworkInstance();
       const contract = network.getContract('chatcc');
        console.log('Submit Chat Contact creation transaction.');
    
        const chatRequestBuffer = await contract.submitTransaction("createChatRequest",room_id,room_name,userId,userName);
        
        let newChatRequest = JSON.parse(chatRequestBuffer.toString());
        console.log(`${newChatRequest.room_id}  successfully created`);
        console.log('Transaction complete.');
        return newChatRequest;
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


main("10000_room", "Suresh_chat_room", "user_1234","user_name_1234" ).then(() => {

    console.log('ChatRequest created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
