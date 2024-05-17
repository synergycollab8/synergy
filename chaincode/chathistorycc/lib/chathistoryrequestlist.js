/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const ChatHistoryRequest = require('./chathistoryrequest.js');

class ChatHistoryRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.ChatHistoryRequestList');
        this.use(ChatHistoryRequest);
    }

    async addChatHistoryRequest(chathistoryrequest) {
        return this.addState(chathistoryrequest,"ChatHistoryRequestEvent");
    }

    async getChatHistoryRequest(room_id) {
        return this.getState(room_id);
    }

    async updateChatHistoryRequest(chathistoryrequest) {
        return this.updateState(chathistoryrequest,"ChatHistoryRequestEvent");
    }

    async getChatHistoryRequestList(){
        return this.getList();
    }
}
module.exports = ChatHistoryRequestList;