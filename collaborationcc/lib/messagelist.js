/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Message = require('./message.js');

class MessageList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.messagelist');
        this.use(Message);
    }

    async addMessage(message) {
        return this.addState(message,"MessageEvent");
    }

    async getMessage(roomId) {
        return this.getState(roomId);
    }

    async updateMessage(message) {
        return this.updateState(message,"MessageEvent");
    }

    async getMessageList(){
        return this.getList();
    }
}
module.exports = MessageList;
