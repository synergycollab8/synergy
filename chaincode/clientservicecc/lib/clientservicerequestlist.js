/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const ClientServiceRequest = require('./clientservicerequest.js');

class ClientServiceRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.ClientServiceRequestList');
        this.use(ClientServiceRequest);
    }

    async addClientServiceRequest(clientservicerequest) {
        return this.addState(clientservicerequest,"ClientServiceRequestEvent");
    }

    async getClientServiceRequest(requestId) {
        return this.getState(requestId);
    }

    async updateClientServiceRequest(clientservicerequest) {
        return this.updateState(clientservicerequest,"ClientServiceRequestEvent");
    }

    async getClientServiceRequestList(){
        return this.getList();
    }
}
module.exports = ClientServiceRequestList;

