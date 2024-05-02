/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Document = require('./document.js');

const documentEvent = "DocumentEvent";
class DocumentList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.org1.synergy.documentlist');
        this.use(Document);
    }

    async addDocument(document) {
        return this.addState(document,documentEvent);
    }

    async getDocument(PathHash) {
        return this.getState(PathHash);
    }

    async updateDocument(document) {
        return this.updateState(document,documentEvent);
    }

    async getDocumentList(){
        return this.getList();
    }
}
module.exports = DocumentList;
