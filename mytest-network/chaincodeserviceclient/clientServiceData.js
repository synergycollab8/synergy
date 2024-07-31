
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

const GET_ALL_CLIENT_SERVICE_REQUEST = "SELECT \"requestId\",issue_type,product,subject,description,message,created_by,status,to_char(date,'MON-DD-YYYY HH12:MIPM') as date FROM client_service_request ORDER BY date DESC";

const getClientServiceRequest = (request, response) => {
    console.log("inside get client service request ...",client);
    client.query(GET_ALL_CLIENT_SERVICE_REQUEST, (error, results) => {
      if (error) {
            throw error
      }
      console.log("results.rows ",results.rows);
      response.status(200).json(results.rows);
    })
  }

module.exports = {getClientServiceRequest}
