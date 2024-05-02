/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Customer = require('./customer.js');

const customerEvent = "CustomerEvent";
class CustomerList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.customerlist');
        this.use(Customer);
    }

    async addCustomer(customer) {
        return this.addState(customer,customerEvent);
    }

    async getCustomer(clientId) {
        return this.getState(clientId);
    }

    async updateCustomer(customer) {
        return this.updateState(customer,customerEvent);
    }

    async getCustomerList(){
        return this.getList();
    }
}
module.exports = CustomerList;
