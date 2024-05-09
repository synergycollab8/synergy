/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract} = require('fabric-contract-api');

// PaperNet specifc classes

const ClientServiceRequestList = require('./clientservicerequestlist.js');
const ClientServiceRequest = require('./clientservicerequest.js');


/**
 * A custom context provides easy access to list of all commercial papers
 */
class ClientServiceContext extends Context {
    constructor() {
        super();
        // All papers are held in a list of papers
        this.clientservicerequestList = new ClientServiceRequestList(this);
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class ClientServiceContract extends Contract {

   
   // constructor() {
        // Unique namespace when multiple contracts per chaincode file
     //   super('com.org1.synergy.ClientServiceRequest');
   // }
       /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new ClientServiceContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the client service contract');
    }

  

        /**
     * Create a new contact  on the network
     * @param {Context} ctx - The transaction context object
     * @param {String} requestId - ID to be used for identifying a client request
     * @param {String} userid - user who create the request
     * @param {String} username - user name
     * @param {String} subject - client service request subject
     * @param {String} description - client service request subject
     * @param {String} productid - product id 
     * @returns
     */


    async createClientServiceRequest(ctx,requestId,issue_type,product,subject,description) {
        let newClientServiceRequest = ClientServiceRequest(requestId,issue_type,product,subject,description);
        console.log("new client request initiated .... ",newClientServiceRequest);
        await ctx.clientrequestList.addClientRequest(newClientServiceRequest);
        return newClientServiceRequest;

    }

    async sendResponse(ctx,requestId, response){
        
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
    

  

}

module.exports = ClientServiceContract;
