/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Contact = require('./contact.js');

class ContactList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.contactlist');
        this.use(Contact);
    }

    async addContact(contact) {
        return this.addState(contact,"ContactEvent");
    }

    async getContact(contactId) {
        return this.getState(contactId);
    }

    async updateContact(contact) {
        return this.updateState(contact,"ContactEvent");
    }

    async getContactsList(){
        return this.getList();
    }
}
module.exports = ContactList;
