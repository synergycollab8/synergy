
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


async function getClientRequest(req,response) {

    console.log('=========== Start: getClientServiceRequet =========',req);
    console.log("select \"requestId\",issue_type,product,subject,description,message,created_by,status,to_char(date,'MON-DD-YYYY HH12:MIPM') as date from client
_service_request where requestId='"+req+"'");
        var query = "select \"requestId\",issue_type,product,subject,description,message,created_by,status,to_char(date,'MON-DD-YYYY HH12:MIPM') as date from cl
ient_service_request where "+"\"requestId\""+"='"+req+"'";

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

async function getClientRequestextn(req,response) {

    console.log('=========== Start: getClientServiceRequest extn =========',req);
    console.log("select split_part(message,'-','1') as event,split_part(message,'-','2') as message,message as act_message,message_from,\"requestId\",to_char(da
te,'MON-DD-YYYY HH12:MIPM') from client_service_req_extn where requestId='"+req+"'");
    var query = "select split_part(message,'-','1') as event,split_part(message,'-','2') as message,message as act_message,message_from,\"requestId\",to_char(da
te,'MON-DD-YYYY HH12:MIPM')  from client_service_req_extn where "+"\"requestId\""+"='"+req+"'";

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

module.exports = {getContactRequest,getClientRequest,getClientRequestextn}
