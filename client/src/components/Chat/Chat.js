import React, { useState,useEffect } from "react";
import queryString from "query-string";
import io from 'socket.io-client';
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input"; 
import Messages from "../Messages/Messages";

// Right side components
import InfoBarRight from "../rightSideComponents/InfobarRight/InfoBarRight"
import People from "../rightSideComponents/People/People"; 
import Voice from "../rightSideComponents/Voice/Voice"

let socket; 
const Chat = ({ location })=> { 

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState(''); 
    const [ messageToSend, setMessage ] = useState('');   // for sending message 
    const [ messages, setMessages ] = useState([]); // for received message 
    const [ usersOnline, setUsersOnline ] = useState([]);

    const ENDPOINT = 'localhost:5000'; //server 

    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room); 

        socket.emit('join',{name,room},()=>{
            //this function is called if server wants to reply with a message(eg:error) on this join event 
        }); //{name,room} es6 is actually {name:name, room:room} 

        return () => { //component unmounting 
            socket.emit('disconnect');
            socket.off(); 
        }
    },[ENDPOINT,location.search]);  

    
    useEffect(()=>{
        socket.on('message',(messageReceived)=>{
            console.log(messageReceived); 
            setMessages((messages)=>[...messages,messageReceived]); 
            console.log("Socket code ran"); 
        });

        socket.on('users-online',({users})=>{
                setUsersOnline((usersOnline) => users); 
                console.log((usersOnline)=> users); 
        }); 
        console.log("use effect ran"); 
    },[]); // for received message 
    


    //useEffect(()=>{
    //    socket.on('')
    //}); 
    // socket.on('usersOnline',(users)=>{
    //     setUsersOnline(users); 
    //     console.log(usersOnline); 
    // }); 

    //need function for sending messages 
    const sendMessage = (event) => { 
        event.preventDefault(); // prevents from refreshing browser, form submit reloads the page  
        if(messageToSend) {
            socket.emit('user-message',messageToSend,()=>setMessage('')); 
        }
    }
      
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/> 
                <Messages messages={messages} name={name}/>
                <Input setMessage={setMessage} sendMessage={sendMessage} messageToSend={messageToSend} /> 
            </div>
            <div className="container-right">
                <InfoBarRight/> 
                <People usersOnline={usersOnline} /> 
                <Voice /> 
            </div>
        </div>
    ); 
}

export default Chat; 

/*
location is a prop that react router gives , i.e web page location uri 
*/
/*
 queryString helps us extract the parameters after /chat
 i.e a?b&&c?d converts to object { a:b, c:d } because if queryString
*/