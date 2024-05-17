const express = require("express");
require('dotenv').config();
global.__basedir = __dirname;
const hostname = process.env.HOST;
const port = process.env.PORT;
const cors = require("cors");
const multer = require('multer');
const fs = require('fs');
const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({host:process.env.IPFS_HOST1,port:process.env.IPFS_PORT1,protocol:'http'});

const fileUpload = require('express-fileupload');
const baseUrl = "http://".concat(hostname).concat(":").concat(port).concat("/files");
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var uuidv4 = require('uuid').v4;
const bodyParser = require("body-parser");
const { response } = require("express");

const roomService = require('./services/room/roomservice');
const messageService = require('./services/sendmessage');
const contacts = require("./services/contacts");
const documentHandler = require("./services/documentHandler");
const authentication = require("./services/authentication");
const customerInfoService = require('./services/getCustomerInfo');
const docInfo = require('./services/getDocumentDetails');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload({
  createParentPath: true
}));
// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set("title", "Synergy Collaboration App");
app.use(cors({
  exposedHeaders: ['Content-Disposition'],
}));
let rooms = [];
let chatLogs = [];
let fileBuffer;
app.get("/", (req, res) => res.json("hello ding"));
app.get("/contacts",contacts.getContacts);

     io.on('connection', function(socket){
  
      socket.on('event://send-message', function(msg){
        //console.log("got", msg);
        
        const payload = JSON.parse(msg);
       /*  if(chatLogs[payload.roomId]){
          chatLogs[payload.roomId].push(payload.data);
        }
        console.log("chatLogs ",chatLogs); */

        //call blockchain network and submit the message
        messageService
        .execute(payload.roomId,payload.data.message,payload.data.sentby,payload.data.messageId)
        .then((newRoom) => {
          console.log("message sent successfully",newRoom);
        })
        .catch((e) => {
          const result = {
            status: "error",
            message: "Failed",
            error: e,
          };
          res.status(500).send(result);
        });
      });
  
    });
    
    app.post('/room', function (req, res, next) {
      //console.log('create room ',req.query.name);
      let chatRoomDetails = req.body.chatRoomDetails;
      let requestedBy = chatRoomDetails.requestedBy;
      let contactObj = chatRoomDetails.contact;
     // console.log('create room ',contactObj);
      const room = {
        name: contactObj.username,
        requestedBy: requestedBy,
        id: uuidv4()
      };
     // console.log("creat room ",room);
      rooms[room.id] = room;
      chatLogs[room.id] = [];
    //  console.log("chatlogs while creating room\ ",chatLogs);

      roomService
        .execute(room,contactObj)
        .then((newRoom) => {
          console.log("room created successfully",newRoom);
        })
        .catch((e) => {
          const result = {
            status: "error",
            message: "Failed",
            error: e,
          };
          res.status(500).send(result);
        });

      res.json(room);
    });
    


    app.get('/room/:roomId', function (req, res, next) {
      const roomId = req.params.roomId;
     // console.log('inside specific room id ',roomId)
      const response = {
        ...rooms[roomId],
        chats: chatLogs[roomId]
      };
     // console.log("chat logs ",chatLogs);
      res.json(response);
    });
    
    app.post('/groupMessages', (req, res) => {
      //console.log("request ",req.body.roomId);
      const roomId = req.body.roomId;
      const response = {
        ...rooms[roomId],
        chats: chatLogs[roomId]
      };
      const data= {
        message: req.body.message,
        sentby: req.body.sentby,
        messageId: req.body.messageId,
      }
      const newMessage = {
        "roomId" : roomId,
        "data": {
          message: req.body.message,
          sentby: req.body.sentby,
          messageId: req.body.messageId,
        }
      };
      if(chatLogs[roomId]){
        chatLogs[roomId].push(data);
      }
     // console.log("chat logs ",chatLogs);
    //  console.log("newMessage ",newMessage);
      io.emit('event://get-message', newMessage );
 
      res.json(response);
    }); 

    var iosa = io.of('/chatInvitation');
    iosa.on('connection', function(socket){
          console.log('Connected to Chat Room Invitation namespace');
    });

    app.post('/notifyChatRoom', (req, res) => {
      //console.log("newChatRequest ",req.body.newChatRequest);
      iosa.emit('event://inviteChat', { data: req.body.newChatRequest});
      res.status(200).json("successful");
    });

    var ioda = io.of('/newDocument');
    ioda.on('connection', function(socket){
          console.log('Connected to new document namespace');
    });

    app.post('/notifyDocument', (req,res) => {
     // console.log("new doc request ",req.body.newDocNotification);
      ioda.emit('event://newDocEvent', { data: req.body.newDocNotification});
      res.status(200).json("successful");
    })
    
    app.post('/upload-avatar', async (req, res) => {
      try {
         console.log("req.file",req.files);
         if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
          } else {
              //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
              let avatar = req.files.avatar;
              let fileExt = avatar.name.split('.').pop();
              console.log("avatar ",avatar)
              console.log(" fileExt ======= ",fileExt);
              //Use the mv() method to place the file in upload directory (i.e. "uploads")
              
              iwrite(avatar.data,fileExt).then(function(result,err){
                if(result){
                  //console.log("result ",result);
                  documentHandler.execute(result.path, "Client 1", "user1","na","kyc",fileExt)
                  .then((newDoc) => {
                   // console.log("document created successfully",newDoc);
                    res.json(newDoc);
                  })
                  .catch((e) => {
                    const result = {
                      status: "error",
                      message: "Failed",
                      error: e,
                    };
                    res.status(500).send(result);
                  });
                  //call read only after write is successful
                }
              });
          }
      } catch (err) {
          res.status(500).send(err);
      }
    });
    async function iwrite (file,fileType) {
      try{
        const results = await ipfs.add(file);
       // console.log('results', results);
        return results;
      }catch (error) {
          console.error(`Failed to write: ${error}`);
      }
    }	
    
    async function iread (docHash) {
      try{
          const invfile = await ipfs.get(docHash);
          const currentDir = process.cwd();
        //  console.log("invfile ",invfile," currentDir ",currentDir);
          let chunks =[];
          for await (const file of ipfs.get(docHash)) {
         //   console.log("...............",file.path);
            
            for await (const chunk of file.content) {
              chunks.push(chunk);
            }
            fileBuffer = Buffer.concat(chunks);
            /* var url = currentDir+'/'+docHash;	
            var writeStream = fs.createWriteStream(url);
            writeStream.write(fileBuffer.toString('utf8'));
            writeStream.end(); */
            return fileBuffer;
            //console.log(content.toString())
          }
    
      }catch(error){
          console.log(error);
      }
    }

    async function docViewer (docHash,fileName) {
      try{
          const invfile = await ipfs.get(docHash);
          const directoryPath = __basedir + "/files";
         // const currentDir = process.cwd();
        //  console.log("invfile ",invfile," currentDir ",currentDir);
          let chunks =[];
          for await (const file of ipfs.get(docHash)) {
         //   console.log("...............",file.path);
            
            for await (const chunk of file.content) {
              chunks.push(chunk);
            }
            fileBuffer = Buffer.concat(chunks);
            var url = directoryPath+'/'+fileName;	
            var writeStream = fs.createWriteStream(url);
            writeStream.write(fileBuffer.toString('utf8'));
            writeStream.end(); 
            return baseUrl+"/"+fileName;
          }
    
      }catch(error){
          console.log(error);
      }
    }
    app.get('/viewDocument/:documentId',async (req,res) => {
       const documentId = req.params.documentId;
       const docInfoResult = await docInfo.execute(req.params.documentId)
                      .then(async (result) => {
                        console.log("result ",result);
                        const fileName = documentId+"."+result.docExt;
                        await docViewer(req.params.documentId,fileName)
                              .then((docURL) => {
                                res.status(200).send(docURL);
                              })
                              .catch((e) => {
                                const errorDetails = {
                                  status: "error",
                                  message: "Error while saving file and sending url ",
                                  error: e,
                                };
                                res.status(500).send(errorDetails);
                              }); 
                      }).catch((e) => {
                        const errorDetails = {
                          status: "error",
                          message: "Error while retrieving file from chain ",
                          error: e,
                        };
                        res.status(500).send(errorDetails);
                      }); ;
    })
    app.get('/getDocument/:documentId', async (req, res) => {
        const documentId = req.params.documentId;
        console.log("inside getDocument ",documentId);
            const promise1 = await docInfo.execute(documentId);
            const promise2 = await iread(documentId);

            Promise.all([promise1,promise2]).then(function(values){
              console.log("values[0] ",values[0]);
              console.log("values[1] ",values[1]);
              const docDetails=values[0];
              const fileName = documentId+"."+docDetails.docExt;
              
              let fileType;
                if(docDetails.docExt === 'jpeg'){
                  fileType = 'image/jpeg';
                }else if(docDetails.docExt === 'pdf'){
                  fileType = 'application/pdf';
                }else if(docDetails.docExt === 'svg'){
                  fileType = 'image/svg';
                }else if(docDetails.docExt === 'pptx'){
                  fileType = 'application/pptx';
                }

                console.log("fileType ....",fileType);
                const docBuffer = Buffer.from(values[1], 'base64');
                console.log("docBuffer ",docBuffer);
                const docData = {
                  fileName: fileName,
                  docContent: docBuffer
                }
            
                res.setHeader('X-FileName',fileName);
                res.setHeader('Content-Disposition', "attachment; filename= "+fileName);
                res.setHeader('Content-type', fileType);
                res.send(docBuffer);
            });
       });

    app.post("/auth",authentication.validateUser);


    app.get('/clientInfo/:clientId', async (req, res) => {
      const clientId = req.params.clientId;
      console.log("insiode server client info.. ",clientId);
       await customerInfoService
        .execute(clientId)
        .then((customerInfo) => {
          console.log("customer information retrieved successfully....",customerInfo);
          res.json(customerInfo);
        })
        .catch((e) => {
          const errorDetails = {
            status: "error",
            message: "Failed",
            error: e,
          };
          res.status(500).send(errorDetails);
        }); 
    });

    http.listen(port,hostname, ()=> {
      console.log(`Server running at http://${hostname}:${port}/`);
    });