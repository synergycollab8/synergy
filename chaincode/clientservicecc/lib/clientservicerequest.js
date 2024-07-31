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
class ClientServiceRequest extends State {

    constructor(obj) {
        super(ClientServiceRequest.getClass(), [obj.requestId]);
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
        return ClientServiceRequest.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, ClientServiceRequest);
    }

    static createInstance(requestId,issue_type,product,subject,description,message,created_by,status,message_from,messageinsert) {
        return new ClientServiceRequest({requestId,issue_type,product,subject,description,message,created_by,status,message_from,messageinsert});
    }

    static getClass() {
        return 'com.org1.synergy.clientservicerequest';
    }
}

module.exports = ClientServiceRequest;

