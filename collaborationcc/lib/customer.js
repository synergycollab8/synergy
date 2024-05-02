/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * Docume nt class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Customer extends State {

    constructor(obj) {
        super(Customer.getClass(), [obj.clientId]);
        Object.assign(this, obj);
    }
    setCurrentState(newState) {
        this.currentState = newState;
    }
    
    static fromBuffer(buffer) {
        return Customer.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Customer);
    }

    static createInstance(clientId,customerInfo) {
        return new Customer({clientId,customerInfo});
    }

    static getClass() {
        return 'com.org1.synergy.customer';
    }
}

module.exports = Customer;
