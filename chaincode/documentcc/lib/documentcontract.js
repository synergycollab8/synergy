/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DocumentContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger for Document ===========');
        const documentcontract = [
            {
                doc_hash_code: 'dochashcode_123',
                requestId: 'room_id_123',
                doc_name: 'TradeFinance_req_doc',
                doc_type: 'pdf'
            },
        ];

        for (let i = 0; i < documentcontract.length; i++) {
            documentcontract[i].docType = 'documentrequest';
            await ctx.stub.putState('documentrequest' + i, Buffer.from(JSON.stringify(documentcontract[i])));
            console.info('Added <--> ', documentcontract[i]);
        }
        console.info('============= END : Initialize Ledger for Document ===========');
    }

         /**
     * Function to retrieve a specific contact detail
     * @param {Context} ctx
     * @param {String} requestId 
     */
     async getDocumentRequest(ctx,requestId){
        const documentRequestBytes = await ctx.stub.getState(requestId);
        if(!documentRequestBytes || documentRequestBytes.length === 0){
            throw new Error (`${requestId} does not exist`);
        }
        console.log(documentRequestBytes.toString());
        return documentRequestBytes.toString();
    }

    async createDocumentRequest(ctx,doc_hash_code,requestId,doc_name,doc_type) {
        console.log('=========== Start: createDocumentRequest =========');
        const documentrequest = {
            doc_hash_code,requestId,doc_name,doc_type
        };
        await ctx.stub.putState(doc_hash_code, Buffer.from(JSON.stringify(documentrequest)));
        await ctx.stub.setEvent('eventForChatRequest', Buffer.from(JSON.stringify(documentrequest)));    
        console.info('============= END : createDocumentRequest ===========');
       
        //return ctx.stub.getState(requestId);
         return documentrequest;

    }

    async queryAllData(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeDocumentName(ctx, doc_hash_code, newvalue) {
        console.info('============= START : ChangeDocumentName ===========');

        const chatDocumentRequestAsBytes = await ctx.stub.getState(doc_hash_code); // get the car from chaincode state
        if (!chatDocumentRequestAsBytes || chatDocumentRequestAsBytes.length === 0) {
            throw new Error(`${doc_hash_code} does not exist`);
        }
        const documentRequest = JSON.parse(chatDocumentRequestAsBytes.toString());
        documentRequest.doc_name = newvalue;

        await ctx.stub.putState(room_id, Buffer.from(JSON.stringify(documentRequest)));
        console.info('============= END : ChangeDocumentName ===========');
    }

}

module.exports = DocumentContract;