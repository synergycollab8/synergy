/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const clientservicerequest = require('./clientservicerequest.js');

const clientservicerequestEvent = "clientservicerequestEvent";
class ClientServiceRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.clientcervicerequestlist');
        this.use(clientservicerequest);
    }

    async addClientServiceRequest(clientservicerequest) {
        return this.addState(clientservicerequest,clientservicerequestEvent);
    }

    async getClientServiceRequest(requestId) {
        return this.getState(requestId);
    }

    async updateClientServiceRequest(clientservicerequest) {
        return this.updateState(clientservicerequest,clientservicerequestEvent);
    }

    async getClientServiceRequestList(){
        return this.getList();
    }
}
