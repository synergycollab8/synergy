const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
let fileBuffer;
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
const fs = require('fs');
//const ipfsClient = require('ipfs-http-client');
//const ipfs = new ipfsClient({host:'localhost',port:'5001',protocol:'http'});
//const ipfs1 = new ipfsClient({host:'localhost',port:'5002',protocol:'http'});
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//start app 
const port = process.env.PORT || 6000;


const chatServicerequest = require('./createChatRequest');


//const getclientservicereq = require('./getChatServiceReq');

const chatServiceData = require("./chatServiceData");

const chatHistoryData = require("./createChatHistoryData");

const getChatContactData = require("./serviceDBRequestData");






app.post('/createChat',async(req,res) => {

  try{
    //main("12345", "Issue", "BG","Subjecton Guarantee","Request for Guarantee product" );
    //room_name,room_id,userId,userName
    console.log(req.body.room_name,req.body.room_id,`create chatServiceRequest`);
    const chatrequest = await chatServicerequest.chatRequestDetails(`${req.body.room_id}`,`${req.body.room_name}`,`${req.body.userId}`,`${req.body.userName}`,`$
{req.body.message}`);
    console.log(chatrequest);
    console.log("chat request creation successful");
    res.setHeader('Content-Type', 'application/json');
    res.json(chatrequest);
  }catch(error){
    res.status(500).send(err);
  }
})

/* app.get('/queryAllChatServiceData',async(req,res) => {

  try{
   console.log(`received call for querying allChatServiceData`);
   const reqdata = await getclientservicereq.getAllData();
   console.log(reqdata);
   res.setHeader('Content-Type', 'application/json');
   res.json(reqdata);
  }catch(error){
    res.status(500).send(error);
  }
})

app.get('/queryChatServiceData',async(req,res) => {

  try{
   console.log(`received call for querying allChatServiceData`);
   const reqdata = await getclientservicereq.getChatServiceRequestdata('${req.body.room_id}');
   console.log(reqdata);
   res.setHeader('Content-Type', 'application/json');
   res.json(reqdata);
  }catch(error){
    res.status(500).send(error);
  }
})
*/

//getChatServiceRequestdata(requestId)

app.post('/createChatHistory',async(req,res) => {

  try{
    //main("12345", "Issue", "BG","Subjecton Guarantee","Request for Guarantee product" );
    //room_id,userID,message,timestamp
    console.log(`received call for createChatHistory`);
    const chathistorydata = await chatHistoryData.createChatHistory(`${req.body.room_id}`,`${req.body.userID}`,`${req.body.message}`,Date.now());
    console.log(chathistorydata);
    res.setHeader('Content-Type', 'application/json');
    res.json(chathistorydata);
  }catch(error){
    res.status(500).send(err);
  }
})

app.get('/queryAllChatHistoryData',async(req,res) => {

  try{
   console.log(`received call for querying allChatHistoryData`);
   const reqdata = await getChatHistoryData.getAllData();
   console.log(reqdata);
   res.setHeader('Content-Type', 'application/json');
   res.json(reqdata);
  }catch(error){
    res.status(500).send(error);
  }
})

//app.get("/getAllChatServiceRequests",chatServiceData.getChatServiceRequest);
//app.get("/getAllChatHistoryRequests",chatServiceData.getChatHistoryRequest);
//app.get("/getAllChatServiceRequests",chatServiceData.getAllChatServiceRequests);
//app.get("/getAllChatHistoryRequests",chatServiceData.getAllChatHistoryRequests);

app.post('/getChatRequest',async(req,res) => {

  try{
    console.log('request received at chatrequests API:',req.body.room_id);
    console.log(`received req`);
    const reqdata = await getChatContactData.getChatRequest(`${req.body.room_id}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})


app.post('/getUserChatRequest',async(req,res) => {

  try{
    console.log('request received at chatrequests API:',req.body.userId);
    console.log(`received req`);
    const reqdata = await getChatContactData.getUserChatRequest(`${req.body.userId}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})


app.post('/getChathistory',async(req,res) => {

  try{
    console.log('request received at chatrequests API:',req.body.room_id);
    console.log(`received req`);
    const reqdata = await getChatContactData.getChathistory(`${req.body.room_id}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})

app.post('/getUserChathistory',async(req,res) => {

  try{
    console.log('request received at userchatHistoryrequests API:',req.body.userId);
    console.log(`received req`);
    const reqdata = await getChatContactData.getUserChathistory(`${req.body.userId}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})


app.post('/getChatHistoryRequests',async(req,res) => {

  try{
    console.log('request received at chatrequests API:',req.body.room_id);
    console.log(`received req`);
    const reqdata = await getChatContactData.getChathistory(`${req.body.room_id}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})




app.listen(port, function(){
  console.log(`listening on *:${port}`);
});
