/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ChatContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger for chat ===========');
        const chatcontract = [
            {
                room_id: 'room_id_123',
                room_name: 'Volvo_issue_roomname',
                userId: 'userid_456',
                userName: 'userName_tayyu'
            },
        ];

        for (let i = 0; i < chatcontract.length; i++) {
            chatcontract[i].docType = 'chatrequest';
            await ctx.stub.putState('chatrequest' + i, Buffer.from(JSON.stringify(chatcontract[i])));
            console.info('Added <--> ', chatcontract[i]);
        }
        console.info('============= END : Initialize Ledger for chat ===========');
    }

         /**
     * Function to retrieve a specific contact detail
     * @param {Context} ctx
     * @param {String} room_id 
     */
     async getChatRequest(ctx,room_id){
        const chatRequestBytes = await ctx.stub.getState(room_id);
        if(!chatRequestBytes || chatRequestBytes.length === 0){
            throw new Error (`${room_id} does not exist`);
        }
        console.log(chatRequestBytes.toString());
        return chatRequestBytes.toString();
    }

    async createChatRequest(ctx,room_id,room_name,userId,userName) {
        console.log('=========== Start: createChatRequest =========');
        const chatrequest = {
            room_id,room_name,userId,userName
        };
        await ctx.stub.putState(room_id, Buffer.from(JSON.stringify(chatrequest)));
        await ctx.stub.setEvent('eventForChatRequest', Buffer.from(JSON.stringify(chatrequest)));    
        console.info('============= END : createChatRequest ===========');
       
        //return ctx.stub.getState(requestId);
         return chatrequest;

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

    async changeRoomName(ctx, room_id, newvalue) {
        console.info('============= START : changeroomName ===========');

        const chatRequestAsBytes = await ctx.stub.getState(room_id); // get the car from chaincode state
        if (!chatRequestAsBytes || chatRequestAsBytes.length === 0) {
            throw new Error(`${room_id} does not exist`);
        }
        const chatRequest = JSON.parse(chatRequestAsBytes.toString());
        chatRequest.room_name = newvalue;

        await ctx.stub.putState(room_id, Buffer.from(JSON.stringify(chatRequest)));
        console.info('============= END : changeroomName ===========');
    }

}

module.exports = ChatContract;