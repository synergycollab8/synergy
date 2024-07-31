/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ClientServiceContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const clientservicecontract = [
            {
                requestId: 'test123',
                issue_type: 'Toyota_issue',
                product: 'Guarantee',
                subject: 'Toyota issue on guarantee',
                description: 'Toyota issue description',
		message:'messageon theclientservice',
		created_by:'testuser1',
		status:'Inprogress',
		message_from:'tesuser2',
		message_insert:'n',
            },
        ];

        for (let i = 0; i < clientservicecontract.length; i++) {
            clientservicecontract[i].docType = 'clientservice';
            await ctx.stub.putState('clientservice' + i, Buffer.from(JSON.stringify(clientservicecontract[i])));
            console.info('Added <--> ', clientservicecontract[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

         /**
     * Function to retrieve a specific contact detail
     * @param {Context} ctx
     * @param {String} requestId 
     */
     async getClientServiceRequest(ctx,requestId){
        const clientServiceRequestBytes = await ctx.stub.getState(requestId);
        if(!clientServiceRequestBytes || clientServiceRequestBytes.length === 0){
            throw new Error (`${requestId} does not exist`);
        }
        console.log(clientServiceRequestBytes.toString());
        return clientServiceRequestBytes.toString();
    }

    async createClientServiceRequest(ctx,requestId,issue_type,product,subject,description,message,created_by,status,message_from,messageinsert) {
        console.log('=========== Start: createClientServiceRequest =========');
        const clientservicerequest = {
            requestId,issue_type,product,subject,description,message,created_by,status,message_from,messageinsert
        };
        await ctx.stub.putState(requestId, Buffer.from(JSON.stringify(clientservicerequest)));
	await ctx.stub.setEvent('eventForClientserviceRequest', Buffer.from(JSON.stringify(clientservicerequest)));    
        console.info('============= END : createClientServiceRequest ===========');
       
        //return ctx.stub.getState(requestId);
	 return clientservicerequest;

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

    async changeIssueType(ctx, requestId, newvalue) {
        console.info('============= START : changeissueType ===========');

        const clientServiceRequestAsBytes = await ctx.stub.getState(requestId); // get the car from chaincode state
        if (!clientServiceRequestAsBytes || clientServiceRequestAsBytes.length === 0) {
            throw new Error(`${requestId} does not exist`);
        }
        const clientServiceRequest = JSON.parse(clientServiceRequestAsBytes.toString());
        clientServiceRequest.issue_type = newvalue;

        await ctx.stub.putState(requestId, Buffer.from(JSON.stringify(clientServiceRequest)));
        console.info('============= END : changeissueType ===========');
    }

}

module.exports = ClientServiceContract;

