
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/


'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');

const { getContractInstance, disconnect } = require('../../util/networkutil');
// Main program function
async function RoomService(room,contacts) {

    try {
        console.log("room ",room, "contacts ",contacts);
       
        const contract = await getContractInstance();
        // issue commercial paper
        console.log('Submit chatroom creation transaction........',JSON.stringify(contacts));
        const chatRoomBuffer = await contract.submitTransaction("createRoom",room.id,room.requestedBy,room.name, JSON.stringify(contacts));
        console.log("chatRoomBuffer ",chatRoomBuffer.toString());
        const newChatRoom = JSON.parse(chatRoomBuffer.toString());

        console.log(`${newChatRoom}  successfully created`);
        console.log('Transaction complete.');
        
        return newChatRoom;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}

module.exports.execute = RoomService;
/* 
RoomService().then(() => {
    console.log('room  created successfully');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
}); */
