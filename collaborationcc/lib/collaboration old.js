/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Contact = require('./contact.js');
const ContactList = require('./contactlist.js');
const Message = require('./message.js');
const MessageList = require('./messagelist.js');
const Document = require('./document.js');
const DocumentList = require('./documentlist.js');
const Customer = require('./customer.js');
const CustomerList = require('./customerlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class ContactContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.contactList = new ContactList(this);
      //  this.messageList = new MessageList(this);
      //  this.documentList = new DocumentList(this);
      //  this.customerList = new CustomerList(this);
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CollaborationContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('com.org1.synergy.contact');
    }
       /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new ContactContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async queryAllCars(ctx) {
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
    async queryAllContacts(ctx) {
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
            allResults.push({ contactId: key, contactDetails: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
 
  /*   async createContact(ctx, contactId,user,phone,email,status,organization,role) {
        console.info('============= START : Create contact ===========');

        const contact = {
            user,
            phone,
            email,
            status,
            organization,
            role
        };

        await ctx.stub.putState(contactId, Buffer.from(JSON.stringify(contact)));
        console.info('============= END : Create contact ===========');
    } */

        /**
     * Create a new contact  on the network
     * @param {Context} ctx - The transaction context object
     * @param {String} contactId - ID to be used for identifying a contact
     * @param {String} user - contact user id
     * @param {String} phone - contact phone
     * @param {String} email - contact email
     * @param {String} status - contact status
     * @param {String} organization - contact organization
     * @param {String} role - contact role
     * @returns
     */

    async createContact(ctx,contactId,user,phone,email,status,organization,role){
        let newContact = Contact.createInstance(contactId,user,phone,email,status,organization,role); 
        console.log("newContact -- before creating a new contact..",newContact);
        await ctx.contactList.addContact(newContact);
        //await ctx.contactList.getContactsList();
        await this.getContactsByRange(ctx,'','');
        return newContact;
    } 
   
    /**
     * Function to retrieve a specific contact detail
     * @param {Context} ctx
     * @param {String} contactId 
     */
    async getContact(ctx,contactId){
        const contactBytes = await ctx.stub.getState(contactId);
        if(!contactBytes || contactBytes.length === 0){
            throw new Error (`${contactId} does not exist`);
        }
        console.log(contactBytes.toString());
        return contactBytes.toString();
    }
    async getContactsByRange(ctx, startKey, endKey) {

		let resultsIterator = await ctx.stub.getStateByRange(startKey, endKey);
		let results = await this.getAllResults(resultsIterator, false);
        console.info("results ",results);
		return JSON.stringify(results);
	}
    async getAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
    }
    /**
     * 
     * @param {Context} ctx 
     * @param {String} roomId 
     * @param {String} roomName 
     * @param {String[]} contacts 
     */
    async createRoom(ctx, roomId,requestedBy,roomName,contacts) {
        console.info('============= START : Create chatroom ===========');
        const chatRoom = {
            roomId,
            requestedBy,
            roomName,
            contacts,
        };
        console.log("chatRoom..... ",chatRoom);
        await ctx.stub.putState(roomId, Buffer.from(JSON.stringify(chatRoom)));
        await ctx.stub.setEvent("RoomEvent", Buffer.from(JSON.stringify(chatRoom)));
        console.info('============= END : chatroom created  ===========');
        return chatRoom;
    } 

    /**
    * 
    * @param {Context} ctx 
    * @param {String} roomId 
    * @param {String} message
    * @param {String} sentBy 
    */
    async sendMessage(ctx,roomId,message,sentBy,messageId){
        let newMessage = Message.createInstance(roomId,message,sentBy,messageId);
        console.log("new message ",newMessage);
        await ctx.messageList.addMessage(newMessage);
        return newMessage;
    }

    /**
     * 
     * @param {Context} ctx 
     * @param {String} PathHash 
     * @param {String} CustomerId 
     * @param {String} createdBy 
     * @param {String} lastModifiedBy 
     * @param {String} docType 
     * @param (String) docExt
     */
    async addDocHash(ctx, PathHash, CustomerId, createdBy, lastModifiedBy,docType,docExt) {
        console.info('============= START : Register Document ===========');
        let newDoc = Document.createInstance(PathHash, CustomerId, createdBy, lastModifiedBy,docType,docExt);
        console.log("document meta info .... ",newDoc);
        await ctx.documentList.addDocument(newDoc);
        console.info('============= END : document metadata added to blockchain  ===========');
        return newDoc;
    }
    
    /**
     * 
     * @param { Context } ctx 
     * @param { String } PathHash 
     */
    async getDocHashDetails(ctx,PathHash){

        let documentKey  = Document.makeKey([PathHash]);
        // Return value of user account from blockchain
        let documentDetailsBuffer = await ctx.documentList
        .getDocument(documentKey)
        .catch((err) => console.log(err));
        return documentDetailsBuffer;
    }
	 /**
     * 
     * @param {Context} ctx 
     * @param {String} clientId 
     * @param {String} customerInfo 
     */
    async createCustomer(ctx,clientId,customerInfo){
        let newCustomer = Customer.createInstance(clientId,customerInfo);
        console.log("New Customer -- before creating a new contact..",newCustomer);
        await ctx.customerList.addCustomer(newCustomer);
        return newCustomer;
    }

   /**
   *
   * @param {Context} ctx
   * @param {String} clientId
   */
    async getCustomer(ctx, clientId) {
        let clientIdKey = Customer.makeKey([clientId]);
        // Return value of user account from blockchain
        let clientBuffer = await ctx.customerList
        .getCustomer(clientIdKey)
        .catch((err) => console.log(err));
        return clientBuffer;
    }
    /** 
     * 
     * @param {Context} ctx 
     * @param {String} clientId 
     * @param {String} customerInfo 
     */
    async customerCDDScreening(ctx,clientId,customerInfo){
        let newCustomerCDDScreening = Customer.createInstance(clientId,customerInfo);
        console.log("New Customer -- before creating a new contact..",newCustomerCDDScreening);
        await ctx.customerList.addCustomer(newCustomerCDDScreening);
        return newCustomerCDDScreening;
    }
}

module.exports = CollaborationContract;
