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
class Contact extends State {

    constructor(obj) {
        super(Contact.getClass(), [obj.contactId]);
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
        return Contact.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Contact);
    }

    static createInstance(contactId,user,phone,email,status,organization,role) {
        return new Contact({contactId,user,phone,email,status,organization,role});
    }

    static getClass() {
        return 'com.org1.synergy.contact';
    }
}

module.exports = Contact;
