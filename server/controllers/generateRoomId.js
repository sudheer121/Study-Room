const randomstring = require("randomstring");
const controlRooms = require("./controlRooms"); 

const generateRoomId = () => {
    let gen = randomstring.generate(10).toLowerCase();
    if(controlRooms.checkRoomExists(gen)){
        return generateRoomId(); 
    }
    controlRooms.addRoom(gen); 
    return gen; 
}

module.exports = {
    generateRoomId 
}
