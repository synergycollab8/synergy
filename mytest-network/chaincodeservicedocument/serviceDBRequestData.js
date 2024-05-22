
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

//const GET_ALL_CLIENT_SERVICE_REQUEST = "SELECT * FROM client_service_request ORDER BY date DESC";


// async function getContactRequest(req,response) {
   //     console.log('=========== Start: getContactServiceRequest =========',req.body);
//      console.log("select * from contact where email='"+req.body.email+"'");

//        client.query("select * from contact where email='"+req.body.email+"'", (error, results) => {
  //    if (error) {
    //        throw error
     // }
     // console.log("results.rows in function",results.rows);
      //response.status(200).json(results.rows);
     // return results.rows;
     // })
   // }

async function getContactRequest(req,response) {

    console.log('=========== Start: getContactServiceRequest =========',req);
    console.log("select * from contact where email='"+req+"'");
    var query = "select * from contact where email='"+req+"'";

    return new Promise(function (resolve, reject) {
        console.log(query);
       client.query(query, function(err, result) {
           if (err) {
              console.log(err);
              return reject(err);
           } else {
              if (result.rowCount > 0) {
                  console.log(result);
                  return resolve(result.rows);
              }
           }
           return resolve(false);
       });
   });
};


async function getDocumentbyRequestId(req,response) {

    console.log('=========== Start: getDocumentServiceRequet =========',req);
    console.log("select * from document where requestId='"+req+"' order by timestamp desc");
        var query = "select * from document where "+"\"requestId\""+"='"+req+"' order by timestamp desc";

    return new Promise(function (resolve, reject) {
       client.query(query, function(err, result) {         
           if (err) {
              return reject(err);
           } else {
              if (result.rowCount > 0) {
                  return resolve(result.rows);
              } 
           }
           return resolve(false);
       });
   });
};

async function getDocumentbyhashcode(req,response) {

    console.log('=========== Start: getdocumentRequest by dochashcode  =========',req);
    console.log("select * from document where doc_hash_code='"+req+"' order by timestamp desc");
    var query = "select * from document where "+"\"doc_hash_code\""+"='"+req+"' order by timestamp desc";

    return new Promise(function (resolve, reject) {
       client.query(query, function(err, result) {
           if (err) {
              return reject(err);
           } else {
              if (result.rowCount > 0) {
                  return resolve(result.rows);
              }
           }
           return resolve(false);
       });
   });
};

//async function getClientRequestextn(req,response) {
  //      console.log('=========== Start: getClientServiceRequestextn =========',req);
    //    console.log("select * from client_service_request_extn where "+"\"requestId\""+"='"+req+"'");

      //  client.query("select * from client_service_request_extn where "+"\"requestId\""+"='"+req+"'", (error, results) => {
      //if (error) {
        //    throw error
     // }
      //console.log("results.rows in function",results.rows);
      //response.status(200).json(results.rows);
      //return results.rows;
      //})
   // }

module.exports = {getContactRequest,getDocumentbyRequestId,getDocumentbyhashcode}
