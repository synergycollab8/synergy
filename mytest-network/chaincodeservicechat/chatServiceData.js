
'use strict';

const path = require('path');
const pg = require('pg');
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DBNAME,
    password: process.env.PG_PWD,
    port: process.env.PG_DBPORT,
});

client.connect();

const GET_ALL_CLIENT_SERVICE_REQUEST = "SELECT * FROM chat ORDER BY timestamp DESC";

const getAllChatServiceRequests = (request, response) => {
    console.log("inside get chat service request ...",client);
    client.query(GET_ALL_CLIENT_SERVICE_REQUEST, (error, results) => {
      if (error) {
            throw error
      }
      console.log("results.rows ",results.rows);
      response.status(200).json(results.rows);
    })
  }

module.exports = {getAllChatServiceRequests}

const GET_ALL_CLIENT_SERVICE_REQUEST1 = "SELECT * FROM chat_history ORDER BY timestamp DESC";

const getAllChatHistoryRequests = (request, response) => {
    console.log("inside get chat history service request ...",client);
    client.query(GET_ALL_CLIENT_SERVICE_REQUEST1, (error, results) => {
      if (error) {
            throw error
      }
      console.log("results.rows ",results.rows);
      response.status(200).json(results.rows);
    })
  }

module.exports = {getAllChatHistoryRequests}
