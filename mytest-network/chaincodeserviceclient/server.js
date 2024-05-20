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
const port = process.env.PORT || 4000;


const clientservicerequest = require('./createClientServiceReq');


const getclientservicereq = require('./getClientServiceReq');

const clientServiceData = require("./clientServiceData");

const contactServiceData = require("./serviceDBRequestData");



app.post('/createClientServiceRequest',async(req,res) => {

  try{
    //main("12345", "Issue", "BG","Subjecton Guarantee","Request for Guarantee product" );
    //requestId,issue_type,product,subject,description
    console.log(req.body.requestId,`create clientServiceRequest`);
    const reqdata = await clientservicerequest.createRequestDetails(`${req.body.requestId}`,`${req.body.issue_type}`,`${req.body.product}`,`${req.body.subject}`
,`${req.body.description}`,`${req.body.message}`,`${req.body.created_by}`,`${req.body.status}`,`${req.body.message_from}`,`${req.body.messageinsert},`${req.body
.messageid}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})

app.get("/getAllClientServiceRequests",clientServiceData.getClientServiceRequest);
//app.post("/getContactRequests",contactServiceData.getContactRequest);


app.get("/getAllClientServiceRequests",clientServiceData.getClientServiceRequest);
//app.post("/getContactRequests",contactServiceData.getContactRequest);

app.post('/getContactRequests',async(req,res) => {

  try{
    console.log('request received at contactrequests:',req.body.email);
    console.log(`received req`);
    const reqdata = await contactServiceData.getContactRequest(`${req.body.email}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})

app.post('/getClientRequests',async(req,res) => {

  try{
    console.log('request received at clientrequests change:',req.body.requestId);
    console.log(`received req`);
    const reqdata = await contactServiceData.getClientRequest(`${req.body.requestId}`);
    console.log('after clientrequest call');
    console.log(reqdata);

    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})


app.post('/getClientRequestExtn',async(req,res) => {

  try{
    console.log('request received at clientrequestextn:',req.body.requestId);
    console.log(`received req`);
    const reqdata = await contactServiceData.getClientRequestextn(`${req.body.requestId}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})

app.get('/queryAllClientServiceData',async(req,res) => {

  try{
   console.log(`received call for querying allServiceData`);
   const reqdata = await getclientservicereq.getAllData(req.requestId);
   console.log(reqdata);
   res.setHeader('Content-Type', 'application/json');
   res.json(reqdata);
  }catch(error){
    res.status(500).send(error);
  }
})


app.listen(port, function(){
  console.log(`listening on *:${port}`);
});
