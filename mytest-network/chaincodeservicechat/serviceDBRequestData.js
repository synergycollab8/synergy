
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


async function getChatRequest(req,response) {

    console.log('=========== Start: getChatServiceRequet =========',req);
    console.log("select room_name,room_id,\"userId\",\"userName\",messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat where room_id='"+re
q+"' order by timestamp desc");
        var query = "select room_name,room_id,\"userId\",\"userName\",messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat where "+"\"room
_id\""+"='"+req+"' order by timestamp desc";

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

async function getDistinctUserChat(req,response) {

    console.log('=========== Start: getDistinctUserChatRequest =========',req);
    console.log("select distinct \"userID\" from chat_history where room_id='"+req+"'");
        var query = "select distinct \"userID\" from chat_history where "+"\"room_id\""+"='"+req+"'";

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

async function getUserChatRequest(req,response) {

    console.log('=========== Start: getUserChatRequest =========',req);
    console.log("select distinct room_id,room_name,description from chat_history where \"userID\"='"+req+"'");
        var query = "select distinct room_id,room_name,description from chat_history where "+"\"userID\""+"='"+req+"'";

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

async function getChathistory(req,response) {

    console.log('=========== Start: getChathistory request =========',req);
    console.log("select room_id,\"userID\",message,messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat_history where room_id='"+req+"' or
der by timestamp desc");
    var query = "select room_id,\"userID\",message,messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat_history where "+"\"room_id\""+"='"
+req+"' order by timestamp desc";

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

async function getOnlineUser(req,response) {

    console.log('=========== Start: getOnlineUser request =========',req);
    console.log("select * from (select distinct CONCAT(\"userID\",'_YES' )as \"userid\" ,cn.user from chat_history c join contact cn on c.\"userID\"=cn.\"contac
tId\" where room_id='"+req+"' union select CONCAT(cn.\"contactId\",'_NO') as \"userid\",cn.user from contact cn join chat_history c on cn.\"contactId\" != c.\"u
serID\" where room_id='"+req+"' ) as usertable order by usertable asc");
    var query = "select * from (select distinct CONCAT(\"userID\",'_YES' )as \"userid\",cn.user from chat_history c join contact cn on c.\"userID\"=cn.\"contact
Id\" where room_id='"+req+"' union select CONCAT(cn.\"contactId\",'_NO') as \"userid\",cn.user from contact cn join chat_history c on cn.\"contactId\" != c.\"us
erID\" where room_id='"+req+"' ) as usertable order by usertable asc";

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

async function getUserChathistory(req,response) {

    console.log('=========== Start: getChathistory request =========',req);
    console.log("select room_id,\"userID\",message,messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat_history where \"userID\"='"+req+"'
 order by timestamp desc");
    var query = "select room_id,\"userID\",message,messageid,description,to_char(timestamp,'MON-DD-YYYY HH12:MIPM') from chat_history where "+"\"userID\""+"='"+
req+"' order by timestamp desc";

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

module.exports = {getContactRequest,getChatRequest,getUserChatRequest,getChathistory,getUserChathistory,getDistinctUserChat,getOnlineUser}
