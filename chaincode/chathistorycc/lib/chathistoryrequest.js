/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * ClientServiceRequest class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class ChatHistoryRequest extends State {

    constructor(obj) {
        super(ChatHistoryRequest.getClass(), [obj.room_id]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    
    static fromBuffer(buffer) {
        return ChatHistoryRequest.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, ChatHistoryRequest);
    }

    static createInstance(room_id,userId,message) {
        return new ChatHistoryRequest({room_id,userId,message});
    }

    static getClass() {
        return 'com.org1.synergy.chathistory';
    }
}

module.exports = ChatHistoryRequest;