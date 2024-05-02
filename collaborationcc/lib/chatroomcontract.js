/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const ChatRoom = require('./chatroom');
const ChatRoomList = require('./chatroomlist');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class ChatRoomContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.chatRoomList = new ChatRoomList(this);
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class ChatRoomContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('com.org1.synergy.chatroom');
    }
       /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new ChatRoomContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the chatroom contract');
    }

 
     /**
     * Function to create a room and notify target 
     * @param {Context} ctx 
     * @param {*} room 
     * @param {*} contacts 
     */
    async createRoom(ctx,roomId,roomName,contacts){
        console.info('============= START : Create room ===========');
        let newRoom = ChatRoom.createInstance(roomId,roomName,contacts);
        console.log("new chat room created ",newRoom);
        await ctx.chatRoomList.addChatRoom(newRoom);
        console.info('============= END : Room created successfully ===========');
        return newRoom;
    }
  
}

module.exports = ChatRoomContract;

