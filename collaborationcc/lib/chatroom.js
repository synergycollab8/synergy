/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * Contact class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class ChatRoom extends State {

    constructor(obj) {
        super(Contact.getClass(), [obj.roomId]);
        Object.assign(this, obj);
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */

    setCurrentState(newState) {
        this.currentState = newState;
    }
    
    static fromBuffer(buffer) {
        return ChatRoom.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, ChatRoom);
    }

    static createInstance(roomId,roomName,contacts) {
        return new ChatRoom({roomId,roomName,contacts});
    }

    static getClass() {
        return 'com.org1.synergy.chatroom';
    }
}

module.exports = ChatRoom;
