const users = [] ;
const addUser = ({id,name,room})=>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(!name || !room) return { error: 'Username and room are required.' };
    if(existingUser) return { error: 'Username is taken.' };
    
    const user = {id,name,room};
    users.push(user);
    return user; 
}
const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];

}
  
// const getUser = (id) => users.find((user) => user.id === id);
const getUser = (id) => {
    const checkUser = (user)=>{ 
        return user.id === id; 
    } 

    return users.find(checkUser); 
}

const getUsersInRoom = (room) => {
    const getUsers = (user) => {
        return user.room === room; 
    }
    
    const filteredArray =  users.filter(getUsers); 
    if(!filteredArray.length) {
        console.log("herer"); 
        return []; 
    }
    //const arr = filteredObjects.map((user) => user.name); 
    var list = filteredArray.map((obj) => obj.name); 
    console.log(typeof list[0]); 
    return list; 
} 

module.exports = { addUser, removeUser, getUser, getUsersInRoom };