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
const port = process.env.PORT || 7000;


const documentservicerequest = require('./createDocumentRequest');


const getdocumentservicereq = require('./serviceDBRequestData');

//const clientServiceData = require("./clientServiceData");



app.post('/createDocumentRequest',async(req,res) => {

  try{
    //main("12345", "Issue", "BG","Subjecton Guarantee","Request for Guarantee product" );
    //requestId,issue_type,product,subject,description
    console.log(req.body.doc_hash_code,req.body.doc_name,`create documentRequest`);
    const reqdata = await documentservicerequest.createDocumentRequest(`${req.body.doc_hash_code}`,`${req.body.requestId}`,`${req.body.doc_name}`,`${req.body.doc_type}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})



app.post('/getDocumentbyHashcode',async(req,res) => {

  try{
    console.log(req.body);
    console.log(`received req for querying documentbyHashcode`);
    const reqdata = await getdocumentservicereq.getDocumentbyhashcode(`${req.body.doc_hash_code}`);
    console.log(reqdata);
    res.setHeader('Content-Type', 'application/json');
    res.json(reqdata);
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})

app.post('/getDocumentbyRequestId',async(req,res) => {

  try{
   console.log(`received call for querying documentby requestId`);
   const reqdata = await getdocumentservicereq.getDocumentbyRequestId(`${req.body.requestId}`);
   console.log(reqdata);
   res.setHeader('Content-Type', 'application/json');
   res.json(reqdata);
  }catch(error){
    res.status(500).send(error);
  }
})


app.post('/placeDocumentRequest',async(req,res) => {

  try{
   console.log(`received call for post request on Documentupload to IPFS`);
   console.log(`req`);
   const reqdata = await documentservicerequest.placeDocumentRequest(`${req.body.requestId}`,`${req.body.doc_hash_code}`,`${req.body.doc_name}`,`${req.body.doc_path}`);
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
