
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

const GET_ALL_CONTACTS = "SELECT * FROM CONTACTS ORDER BY id ASC";

const getContacts = (request, response) => {
    console.log("inside get contacts ...",client);
    client.query(GET_ALL_CONTACTS, (error, results) => {
      if (error) {
        throw error
      }
      console.log("results.rows ",results.rows);
      response.status(200).json(results.rows);
    })
  }

module.exports = {getContacts}
