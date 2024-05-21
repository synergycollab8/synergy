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


// Define the API URL
const apiUrl = 'http://localhost:3000/api/refreshComponent?component=servicerequest';
const apiUrl2 = 'http://localhost:3000/api/refreshComponent?component=servicerequest&message=';

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
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'Org1', 'ccp-Org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
           const issue_typeName = 'User1@Org1';
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: issue_typeName, discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(`mytestchannel`);
       
        const contract = await network.getContract(`clientservicecontract1`);
        console.log(contract);

       
        await contract.addContractListener(async (event) => {
        
            event = event.payload.toString("utf-8");
            event = JSON.parse(event);
            console.log("******************************************");
            console.log(event);
            console.log(`${event.requestId}, ${event.issue_type}, ${event.product}, ${event.subject},${event.description},${event.message},${event.created_by},$
{event.messageid}`);
            console.log("******************************************");
            const requestId =  event.requestId;
            const messageinsert = event.messageinsert;
            
            if(requestId){

                const query1 = `set search_path to mynetwork`;

                client.query(query1, (err, res) => {
                  if (err) {
                    console.error(err);
                     return;
                  }
                   //console.log(res);
                 });
                const query = `INSERT INTO public."client_service_request"("requestId", issue_type, product, subject, description,message,created_by,status,date
) VALUES ('${event.requestId}', '${event.issue_type}', '${event.product}', '${event.subject}','${event.description}','${event.message}','${event.created_by}','$
{event.status}',current_timestamp) ON CONFLICT ("requestId") DO UPDATE SET "requestId"=excluded."requestId", issue_type=excluded.issue_type, product=excluded.pr
oduct, subject=excluded.subject, description=excluded.description,message=excluded.message,created_by=excluded.created_by,status=excluded.status,date=current_ti
mestamp`;
                client.query(query, (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Data insert successful'); 
                });

                var eventString = `${event.message}`;
                var index = eventString.indexOf("-"); // Gets the first index where a space occours
                var eventid = eventString.substr(0, index); // Gets the first part
                var text = eventString.substr(index + 1); // Gets the text part
                var requestid = `${event.requestId}`;
                var createdby = `${event.created_by}`;
                var date = Date.now();
                    // Create a Date
                const time = new Date();
                let text1 = time.toLocaleString();
                console.log('print date format');
                console.log('print values:',eventString,index,eventid,text,requestid,createdby,date,time,text1);
                console.log(`{"user":"${createdby}","title":"${eventid} for ${requestid}" ,"message":"${text}","component":"notificationBar", "time":"${text1}"}
`);
                      
                // Make a POST request
                fetch(apiUrl,{
                     // body: '{\"message\":\"Request acknowledgment message from ${event.message_from} for request ID:${event.requestId}\"}'
                      method: 'POST',
                      body: `{"user":"${createdby}","title":"${eventid} for ${requestid}" ,"message":"${text}","component":"notificationBar", "time":"${text1}"}
`

                }).then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    }).then(data => {
                   console.log(data);
                }).catch(error => {
                console.error('Error:', error);
                });

                if (messageinsert){
                console.log('message insert triggered');
               const queryextn = `INSERT INTO public."client_service_req_extn"("requestId",message,message_from,messageid,date) VALUES ('${event.requestId}','${
event.message}','${event.message_from}','${event.messageid}',current_timestamp)`;
                client.query(queryextn, (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Message data insert successful');
                });
              //}
             
                // Make a POST request
                fetch(apiUrl,{
                      method: 'POST',
                      body: `{"user":"${createdby}","title":"${eventid} for ${requestid}","message":"${text}","component":"notificationBar", "time":"${text1}"}`
                        // body: '{\"message\":\"Request created from ${event.created_by} having request ID : ${event.requestId}\"}'
                     
                }).then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    }).then(data => {
                   console.log(data);
                }).catch(error => {
                console.error('Error:', error);
                });
               }
            
        }} );
       // console.log(`Listening for block events, nextblock: ${nextBlock}`);
     
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        client.end();
        process.exit(1);
    }

}

main();
