let roomSet = new Set();
let roomQ = []; 

const addRoom = (roomId) => {
    roomSet.add(roomId); 
    roomQ.push({
        roomId : roomId,
        createdAt : new Date()
    })
}

const checkRoomExists = (roomId) => {
    return roomSet.has(roomId); 
}

const deQRoom = () => { //removes room created before 12 hours 
    if(roomQ.length === 0){
        return; 
    }
    let t1 = roomQ[0].createdAt;
    let t2 = new Date(); 
    let diff = t2.getTime() - t1.getTime(); 
    if(diff < 60) {
        return; 
    }
    console.log("Deleting",roomQ[0].roomId); 
    roomSet.delete(roomQ[0].roomId);
    roomQ.shift();
    return deQRoom(); 
}

module.exports = {
    addRoom,
    checkRoomExists,
    deQRoom
}
