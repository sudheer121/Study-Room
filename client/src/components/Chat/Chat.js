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

let socket = null; 
const Chat = ({ location })=> { 

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState(''); 
    const [ messageToSend, setMessage ] = useState('');   // for sending message 
    const [ messages, setMessages ] = useState([]); // for received message 
    const [ usersOnline, setUsersOnline ] = useState([]);

    const [ join,setJoin ] = useState(0); 
    const [ usersInVoice, setUsersInVoice ] = useState([]); 

    const ENDPOINT = 'localhost:5000'; //server 

    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 

        socket = io(ENDPOINT);
       
        setName(name);
        setRoom(room); 

        socket.emit('join',{name,room},()=>{
            console.log(socket.id); 
            //this function is called if server wants to reply with a message(eg:error) on this join event 
        }); //{name,room} es6 is actually {name:name, room:room} 
        
        return () => { //component unmounting 
            socket.emit('disconnect');
            socket.off(); 
        }
    },[ENDPOINT,location.search]);  

    
    useEffect(()=>{
        socket.on('message',(messageReceived)=>{
            setMessages((messages)=>[...messages,messageReceived]); 
        });

        socket.on('usersinvoice-before-join',({users})=>{
            console.log(users); 
            setUsersInVoice((usersInVoice) => users); 
        }); // list of users in voice channel just  before joining       

        socket.on('users-online',({users})=>{
                setUsersOnline((usersOnline) => users); 
                //console.log((usersOnline)=> users); 
        }); 
        
        socket.on('add-in-voice',(user)=>{
            console.log(user); 
            setUsersInVoice( usersInVoice =>[...usersInVoice,user]); 
            console.log(usersInVoice); 
        });
        socket.on('remove-from-voice',(user)=>{
            console.log(user); 
            setUsersInVoice( usersInVoice =>usersInVoice.filter((x) => x.id !== user.id )); 
            console.log({usersInVoice});  
        });
        console.log("use effect ran"); 
    },[]); // for received message 

    
    

    //need function for sending messages 
    const sendMessage = (event) => { 
        event.preventDefault(); // prevents from refreshing browser, form submit reloads the page  
        if(messageToSend) {
            socket.emit('user-message',messageToSend,()=>setMessage('')); 
        }
    }
    
    const joinVoice = ()=> {
        socket.emit('join-voice',{name,room},() => {});
        console.log('voice joined'); 
    }
    const leaveVoice = ()=>{
        socket.emit('leave-voice',{name,room},() => {});
        console.log('voice left')
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
                <div style = {{height:"3px",backgroundColor:"black"}}> </div> 
                <People usersOnline={usersInVoice} /> 
                <Voice usersInVoice={usersInVoice} joinVoice={joinVoice} leaveVoice={leaveVoice} join={join} setJoin={setJoin}/> 
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