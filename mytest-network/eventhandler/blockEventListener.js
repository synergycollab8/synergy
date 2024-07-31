/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

/*

blockEventListener.js is an nodejs application to listen for block events from
a specified channel.

Configuration is stored in config.json:

{
   "peer_name": "peer0.org1.example.com",
   "channelid": "mychannel",
   "use_couchdb":false,
   "couchdb_address": "http://localhost:5990"
}

peer_name:  target peer for the listener
channelid:  channel name for block events
use_couchdb:  if set to true, events will be stored in a local couchdb
couchdb_address:  local address for an off chain couchdb database

Note:  If use_couchdb is set to false, only a local log of events will be stored.

Usage:

node bockEventListener.js

The block event listener will log events received to the console and write event blocks to
a log file based on the channelid and chaincode name.

The event listener stores the next block to retrieve in a file named nextblock.txt.  This file
is automatically created and initialized to zero if it does not exist.

*/

'use strict';

const { Wallets, Gateway,DefaultEventHandlerStrategies,FileSystemWallet } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const axios = require('axios');

const couchdbutil = require('./couchdbutil.js');
const blockProcessing = require('./blockProcessing.js');

const config = require('./config.json');
const channelid = config.channelid;
const peer_name = config.peer_name;
const use_couchdb = config.use_couchdb;
const couchdb_address = config.couchdb_address;

const configPath = path.resolve(__dirname, 'nextblock.txt');

const nano = require('nano')(couchdb_address);
const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');
const { EventEmitter } = require('events');
const API_BASE=`http://${process.env.HOST}:${process.env.PORT}`
const client = new Client({
    user: `${process.env.PG_USER}`,
    host: `${process.env.PG_HOST}`,
    database: `${process.env.PG_DBNAME}`,
    password: `${process.env.PG_PWD}`,
    port: `${process.env.PG_DBPORT}`,
});

client.connect();


// simple map to hold blocks for processing
class BlockMap {
    constructor() {
        this.list = []
    }
    get(key) {
        key = parseInt(key, 10).toString();
        return this.list[`block${key}`];
    }
    set(key, value) {
        this.list[`block${key}`] = value;
    }
    remove(key) {
        key = parseInt(key, 10).toString();
        delete this.list[`block${key}`];
    }
}

let ProcessingMap = new BlockMap();

async function main() {
    try {

        // initialize the next block to be 0
        let nextBlock = 0;

        // check to see if there is a next block already defined
        if (fs.existsSync(configPath)) {
            // read file containing the next block to read
            nextBlock = fs.readFileSync(configPath, 'utf8');
        } else {
            // store the next block as 0
            fs.writeFileSync(configPath, parseInt(nextBlock, 10));
        }

        // Create a new file system based wallet for managing identities.
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'Org1', 'ccp-Org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
	    const userName = 'User1@Org1';
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(`${process.env.BC_CHANNEL}`);
       
        const contract = await network.getContract(`${process.env.BC_CONTRACT}`);
        
        await contract.addContractListener(async (event) => {
        
            event = event.payload.toString("utf-8");
            event = JSON.parse(event);
            console.log("******************************************");
            console.log(event);
            console.log(`${event.contactId}, ${event.user}, ${event.phone}, ${event.email},${event.status},${event.organization}, ${event.role} `);
            console.log("******************************************");
            const contactID =  event.contactId;
            
            if(contactID){
                const query = `
                    INSERT INTO contacts (contactId, username, phone, email,status,organization,orgrole,created_on,last_updated)
                    VALUES ('${event.contactId}', '${event.user}', '${event.phone}', '${event.email}','${event.status}','${event.organization}','${event.role}',current_timestamp,current_timestamp)
                `;
                        
                client.query(query, (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Data insert successful');
                    
                });
            }
            
            const eventClass = event.class;
            console.log("event.class ",event.class);
            console.log("event.roomId ",event.roomId);
            console.log("event.message ",event.message);
            console.log("event.sentby ",event.sentBy);
            if(eventClass === 'com.org1.synergy.message' && event.roomId){
                axios
                    .post(`${API_BASE}/groupMessages`, {
                        roomId: event.roomId,
                        message: event.message,
                        sentby: event.sentBy,
                        messageId: event.messageId,
                    })
                    .then((res) => {
                        console.log("message sent successful");
                    })
                    .catch((error) => {
                        console.error("error in notify chat     ",error)
                    }); 
            }else if(eventClass === 'com.org1.synergy.document'){
                console.log("inside document class");
                console.log(event);
                const newDocNotification = {
                    id: event.PathHash,
                    clientName:event.CustomerId,
                    createdBy: event.createdBy,
                    lastModifiedBy: event.lastModifiedBy,
                    docType: event.docType,
                    docExt: event.docExt
                };
                console.log("newDocNotification....",newDocNotification);
                axios
                    .post(`${API_BASE}/notifyDocument`, {
                        newDocNotification: newDocNotification,
                    })
                    .then((res) => {
                        console.log("successful");
                    })
                    .catch((error) => {
                        console.error("error in notify chat     ",error)
                    });
            }else if(event.roomId){
                console.log("roomId : ",event.roomId);
                console.log("room requested by ",event.requestedBy);
                console.log("room Name :",event.roomName);
                console.log("contacts ",event.contacts);
                const newChatInvitation = {
                    roomId: event.roomId,
                    requestedBy: event.requestedBy,
                    roomName: event.roomName,
                    contacts: event.contacts
                };
                console.log("newChatInvitation....",newChatInvitation);
                axios
                    .post(`${API_BASE}/notifyChatRoom`, {
                        newChatRequest: newChatInvitation,
                    })
                    .then((res) => {
                        console.log("successful");
                    })
                    .catch((error) => {
                        console.error("error in notify chat     ",error)
                    });
            }

          });
       // console.log(`Listening for block events, nextblock: ${nextBlock}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        client.end();
        process.exit(1);
    }
}

main();

