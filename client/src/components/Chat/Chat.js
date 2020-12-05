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
import ReactPlayer from 'react-player'

import Peer from "peerjs"; 

const getAudio = () =>{
     return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
}
let streamsArr = []; 

//https://github.com/WebDevSimplified/Zoom-Clone-With-WebRTC/blob/master/public/script.js

function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
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
    
    //node server endpoint 
    const ENDPOINT = '';
    //process.env.NODE_ENV === 'production' ? process.env.process.env.REACT_APP_NODE_SERVER : process.env.REACT_APP_NODE_SERVER_LOCAL; //server 

    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 

        socket = io(ENDPOINT);
       
        setName(name);
        setRoom(room); 

        socket.emit('join',{name,room},()=>{
            console.log(socket.id); 
            //this function is called if server wants to reply with a message(eg:error) on this join event 
        });
        
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
        const audio = document.createElement('audio');
        audio.srcObject = stream
        audio.addEventListener('loadedmetadata', () => {
            audio.play()
        })
        console.log("receiving an audio stream"); 
        //console.log("Received" + stream);
    }
  
    useEffect(()=>{
        
        if(join) {
            getAudio()
            .then((mystream)=>{
                myStream = mystream; 
                //connect this peer to server
                // peer = new Peer(socket.id,{
                // port: 443,
                // host: "https://0.peerjs.com"
                // })
                peer = new Peer(socket.id,{
                    host:'/',
                    port: 5000,
                    path: '/peerjs'
                }); 

                //listen 
                peer.on('call', (call)=>{
                    call.answer(mystream); 
                    call.on('stream', (stream)=>{
                        onReceiveAudioStream(stream); 
                        receivedCalls.push(stream); 
                    });
                    
                });

                peers = (usersInVoice).map((u) => {  // usersInVoice affects this 
                    
                    //call everyone already present 
                    var mediaConnection = peer.call(u.id, mystream); 
                    
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
                    console.log(mediaConnection); 
                    //peers[u.id] = mediaConnection; 
                    return mediaConnection; 
                }); 
            })
            .catch((error)=>{
                console.log("Error while getting audio",error); 
            })

            //call everyone already there 
            
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