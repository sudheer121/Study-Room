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

import Peer from "peerjs"; 

const getAudio = () =>{
     return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
}

function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live') {
            track.stop();
        }
    });
}

let socket = null, peer = null, peers = [], myStream = null, receivedCalls = [];  
const Chat = ({ location })=> { 

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState(''); 
    const [ messageToSend, setMessage ] = useState('');   // for sending message 
    const [ messages, setMessages ] = useState([]); // for received message 
    const [ usersOnline, setUsersOnline ] = useState([]);

    const [ join,setJoin ] = useState(0); 
    const [ usersInVoice, setUsersInVoice ] = useState([]); 
    
    const ENDPOINT = process.env.REACT_APP_API_ENDPOINT_LOCAL;   // the express server 
    // const ENDPOINT = process.env.REACT_APP_API_ENDPOINT_REAL; // my deployed server 
 
    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 
        socket = io(ENDPOINT, { transport : ['websocket'] });
       
        setName(name);
        setRoom(room); 

        socket.emit('join',{name,room},()=>{
            console.log(socket.id); 
            //this function is called if server wants to reply with a message(eg:error) on this join event 
        });
        
        return () => { //component unmounting 
            socket.emit('leave-voice',{name,room},() => {});
            socket.emit('disconnect');
            socket.off(); 
        }
    },[]); //[ENDPOINT,location.search]);  

    
    useEffect(()=>{
        socket.on('message',(messageReceived)=>{
            setMessages((messages)=>[...messages,messageReceived]); 
        });
        socket.on('usersinvoice-before-join',({users})=>{
            console.log(users); 
            setUsersInVoice((usersInVoice) => users); 
        });       
        socket.on('users-online',({users})=>{
                setUsersOnline((usersOnline) => users); 
        }); 
        socket.on('add-in-voice',(user)=>{
            setUsersInVoice( usersInVoice =>[...usersInVoice,user]); 
        });
        socket.on('remove-from-voice',(user)=>{
            setUsersInVoice( usersInVoice =>usersInVoice.filter((x) => x.id !== user.id )); 
        });
    },[]); // for received message 

    const onReceiveAudioStream = (stream) =>{ 
        console.log("receiving an audio stream"); 
        const audio = document.createElement('audio');
        audio.srcObject = stream
        audio.addEventListener('loadedmetadata', () => {
            audio.play()
        })
    }
  
    useEffect(()=>{
        
        if(join) {
            getAudio()
            .then((mystream)=>{
                myStream = mystream; 
                peer = new Peer(socket.id); 
                //console.log(peer);
                
                //listen 
                peer.on('call', (call)=>{
                    console.log("call receiving")
                    call.answer(mystream); 
                    call.on('stream', (stream)=>{
                        onReceiveAudioStream(stream); 
                        receivedCalls.push(stream); 
                    });
                });
                //console.log(usersInVoice); 
                peer.on('open',()=>{
                    console.log("connected to peerserver"); 
                    peers = (usersInVoice).map((u) => {  // usersInVoice affects this 
                        //call everyone already present 
                        var mediaConnection = peer.call(u.id, mystream); 
                        console.log(`Calling ${u.id}`);
                        //console.log(mediaConnection); 
    
                        const audio = document.createElement('audio');
                        mediaConnection.on('stream', (stream)=>{
                            audio.srcObject = stream
                            audio.addEventListener('loadedmetadata', () => {
                                audio.play()
                            })
                        });
                        // if anyone closes meadia connection 
                        mediaConnection.on('close',()=>{
                            audio.remove();
                        })
                        return mediaConnection; 
                    }); 
                }) 
                
            })
            .catch((error)=>{
                console.log("Error while getting audio",error); 
            })
        } else {
            
            //close my audio 
            if(myStream) stopBothVideoAndAudio(myStream); 
            //close the calls i received
            receivedCalls.forEach((stream) => stopBothVideoAndAudio(stream));
            
            
            if(peer) { 
                peer.disconnect();
                myStream = null; 
                console.log("disconnected"); 

                //close the connections I called 
                if(peers) { 
                    peers.forEach((x)=>{
                        x.close();  
                    })
                    peers = []; 
                }
            }
        }
    },[join]); 
    

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
                <div className="container-up">
                    <InfoBarRight/> 
                    <People usersOnline={usersOnline} /> 
                </div>
                <div className="container-down">  
                    <People usersOnline={usersInVoice} /> 
                    <Voice usersInVoice={usersInVoice} joinVoice={joinVoice} leaveVoice={leaveVoice} join={join} setJoin={setJoin}/> 
                </div>
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