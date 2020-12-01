import React, { useState,useEffect } from "react";
import queryString from "query-string";
import io from 'socket.io-client';
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input"; 
import Messages from "../Messages/Messages";

// Right side components
import InfoBarRight from "../InfobarRight/InfoBarRight"
let socket; 

const Chat = ({ location })=> { 

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState(''); 
    const [ message, setMessage ] = useState('');   // for sending message 
    const [ messages, setMessages ] = useState([]); // for received message 
    const [ usersOnline, setUsersOnline ] = useState('');

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
        socket.on('message',(message)=>{
            console.log(message); 
            setMessages([...messages,message]); 
            //console.log("Socket code ran"); 
        });
        //console.log("use effect ran"); 
    },[message]); // for received message 

    // socket.on('usersOnline',(users)=>{
    //     setUsersOnline(users); 
    //     console.log(usersOnline); 
    // }); 

    //need function for sending messages 
    const sendMessage = (event) => { 
        event.preventDefault(); // prevents from refreshing browser, form submit reloads the page  
        if(message) {
            socket.emit('user-message',message,()=>setMessage('')); 
        }
    }
      
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/> 
                <Messages messages={messages} name={name}/>
                <Input setMessage={setMessage} sendMessage={sendMessage} message={message} /> 
            </div>
            {/* <div className="container-right">
                <InfoBarRight/> 
            </div> */}
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