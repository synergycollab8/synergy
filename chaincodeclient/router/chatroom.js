const express = require('express');


const router = express.Router();
const roomservice = require('../services/room/roomservice');

router.post("/room", (req, res) => {
    console.log('create room ',req.query.name);
    console.log('contacts ',req.query.contacts);
    const room = {
      name: req.query.name,
      id: uuidv4()
    };
    console.log("creat room ",room);
    rooms[room.id] = room;
    chatLogs[room.id] = [];
    console.log("chatlogs while creating room\ ",chatLogs);
    
    const createRoomResponse = roomService(room,contacts);
    console.log("created room in blockchain ",createRoomResponse);

    res.json(room);
})


module.exports = router
