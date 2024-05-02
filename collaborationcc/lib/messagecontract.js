/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Message = require('./message.js');
const MessageList = require('./messagelist.js');


/**
 * A custom context provides easy access to list of all commercial papers
 */
class MessageContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.messageList = new MessageList(this);
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class MessageContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('com.org1.synergy.message');
    }
       /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new MessageContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the message contract');
    }

   /**
    * 
    * @param {Context} ctx 
    * @param {String} roomId 
    * @param {String} message
    * @param {String} sentBy 
    */
    async sendMessage(ctx,roomId,message,sentBy){
        let newMessage = Message.createInstance(roomId,message,sentBy);
        console.log("new message ",newMessage);
        await ctx.messageList.addMessage(newMessage);
        return newMessage;
    }
}

module.exports = MessageContract;
