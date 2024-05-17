/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const ChatRequest = require('./chatrequest.js');

class ChatRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.ChatRequestList');
        this.use(ChatRequest);
    }

    async addChatRequest(chatrequest) {
        return this.addState(chatrequest,"ChatRequestEvent");
    }

    async getChatRequest(room_id) {
        return this.getState(room_id);
    }

    async updateChatRequest(chatrequest) {
        return this.updateState(chatrequest,"ChatRequestEvent");
    }

    async getChatRequestList(){
        return this.getList();
    }
}
module.exports = ChatRequestList;