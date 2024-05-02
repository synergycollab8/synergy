/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * Message class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Message extends State {

    constructor(obj) {
        super(Message.getClass(), [obj.roomId]);
        Object.assign(this, obj);
    }
    setCurrentState(newState) {
        this.currentState = newState;
    }
    
    static fromBuffer(buffer) {
        return Message.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Message);
    }

    static createInstance(roomId,message,sentBy,messageId) {
        return new Message({roomId,message,sentBy,messageId});
    }

    static getClass() {
        return 'com.org1.synergy.message';
    }
}

module.exports = Message;
