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
async function main(room_name,room_id,userId,userName) {

    try {
       //const contract = await getContractInstance();
       const contract = getNetwork().getContract('collaborationcontract');
        console.log('Submit Contact creation transaction.');
    
        const chatBuffer = await contract.submitTransaction("createChat",room_name,room_id,userId,userName);
        
        let newChat = JSON.parse(chatBuffer.toString());
        console.log(`${newChat.room_name}  successfully created`);
        console.log('Transaction complete.');
        return newChat;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}



main("Client1_user1_room", "80056", "user1","Suresh" ).then(() => {

    console.log('ChatRequest created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});