/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const ChatRoom = require('./chatroom');

class ChatRoomList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.chatroomlist');
        this.use(ChatRoom);
    }

    async addChatRoom(chatRoom) {
        return this.addState(chatRoom);
    }

    async getChatRoom(roomId) {
        return this.getState(roomId);
    }

    async updateChatRoom(chatRoom) {
        return this.updateState(chatRoom);
    }
}
module.exports = ChatRoomList;
