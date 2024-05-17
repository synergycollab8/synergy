/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ChatHistoryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger for chat history contract===========');
        const chathsitorycontract = [
            {
                room_id: 'room_id_123',
                message: 'Chathistory_forroomId123',
                userId: 'userid_456'
            },
        ];

        for (let i = 0; i < chathsitorycontract.length; i++) {
            chathsitorycontract[i].docType = 'chathistory';
            await ctx.stub.putState('chathistory' + i, Buffer.from(JSON.stringify(chathsitorycontract[i])));
            console.info('Added <--> ', chathsitorycontract[i]);
        }
        console.info('============= END : Initialize Ledger for chat history ===========');
    }

         /**
     * Function to retrieve a specific contact detail
     * @param {Context} ctx
     * @param {String} room_id 
     */
     async getChathistoryRequest(ctx,room_id){
        const chatHistoryRequestBytes = await ctx.stub.getState(room_id);
        if(!chatHistoryRequestBytes || chatHistoryRequestBytes.length === 0){
            throw new Error (`${room_id} does not exist`);
        }
        console.log(chatHistoryRequestBytes.toString());
        return chatHistoryRequestBytes.toString();
    }

    async createChatHistoryRequest(ctx,room_id,userId,message) {
        console.log('=========== Start: createChatHistoryRequest =========');
        const chathistoryrequest = {
            room_id,userId,message
        };
        await ctx.stub.putState(room_id, Buffer.from(JSON.stringify(chathistoryrequest)));
        await ctx.stub.setEvent('eventForChathistoryRequest', Buffer.from(JSON.stringify(chathistoryrequest)));    
        console.info('============= END : createChatHistoryRequest ===========');
       
        //return ctx.stub.getState(requestId);
         return chathistoryrequest;

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

    async changeRoomMessage(ctx, room_id, newvalue) {
        console.info('============= START : changeRoomMessage ===========');

        const chatHistoryRequestAsBytes = await ctx.stub.getState(room_id); // get the car from chaincode state
        if (!chatHistoryRequestAsBytes || chatHistoryRequestAsBytes.length === 0) {
            throw new Error(`${room_id} does not exist`);
        }
        const chatHistoryRequest = JSON.parse(chatHistoryRequestAsBytes.toString());
        chatHistoryRequest.room_name = newvalue;

        await ctx.stub.putState(room_id, Buffer.from(JSON.stringify(chatHistoryRequest)));
        console.info('============= END : changeRoomMessage ===========');
    }

}

module.exports = ChatHistoryContract;
