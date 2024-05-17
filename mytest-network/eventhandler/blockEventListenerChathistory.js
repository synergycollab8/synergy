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
    //host: `34.124.168.248`,
    //database: `${process.env.PG_DBNAME}`,
    database: `postgres`,
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
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'Org2', 'ccp-Org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
           const issue_typeName = 'User1@Org2';
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: issue_typeName, discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(`mytestchannel`);
       
        const contract = await network.getContract(`chathistorycc`);
        console.log(contract);

       
        await contract.addContractListener(async (event) => {
        
            event = event.payload.toString("utf-8");
            event = JSON.parse(event);
            console.log("******************************************");
            console.log(event);
            console.log(`${event.room_id}, ${event.userId}, ${event.message}`);
            console.log("******************************************");
            const room_id =  event.room_id;
            
            if(room_id){

                const query1 = `set search_path to mynetwork`;

                client.query(query1, (err, res) => {
                  if (err) {
                    console.error(err);
                     return;
                  }
                   //console.log(res);
                 });
                const query = `INSERT INTO public."chat_history"(room_id,"userID",message,"timestamp") VALUES ('${event.room_id}', '${event.userId}', '${event.message}',current_timestamp) ON CONFLICT ("room_id") DO UPDATE SET room_id=excluded.room_id, "userID"=excluded."userID", message=excluded.message,"timestamp"=current_timestamp`;
                client.query(query, (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Data insert successful for chathistory');   
                });
            
        }} );
       // console.log(`Listening for block events, nextblock: ${nextBlock}`);
     
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        client.end();
        process.exit(1);
    }

}

main();
