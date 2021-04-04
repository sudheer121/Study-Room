const express = require("express");
const router = express.Router();
const { generateRoomId } = require("../controllers/generateRoomId"); 
const controlRooms = require("../controllers/controlRooms"); 

router.get("/generateRoomId",async (req,res)=>{
    let roomId =  await generateRoomId();

    res.json({
        success : 1,
        roomId  
    })
})

router.get("/checkRoomExists/:roomId",async (req,res)=>{
    const id = req.params.roomId; 
    let exists =  controlRooms.checkRoomExists(id);

    res.json({
        success : 1,
        exists  
    })
})

module.exports = router 