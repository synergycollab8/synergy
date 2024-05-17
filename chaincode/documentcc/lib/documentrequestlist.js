/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const DocumentRequest = require('./documentrequest.js');

class DocumentRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.DocumentRequestList');
        this.use(DocumentRequest);
    }

    async addChatHistoryRequest(documentrequest) {
        return this.addState(documentrequest,"DocumentRequestEvent");
    }

    async getDocumentRequest(doc_hash_code) {
        return this.getState(doc_hash_code);
    }

    async updateDcoumentRequest(documentrequest) {
        return this.updateState(documentrequest,"DocumentRequestEvent");
    }

    async getDocumentRequestList(){
        return this.getList();
    }
}
module.exports = DocumentRequestList;