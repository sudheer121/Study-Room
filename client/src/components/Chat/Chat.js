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
//import { cred } from "../../config/callcred"; 

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
let cred = null; 

// STUN/TURN servers for voice channel 
const setCredObj = (twilioObj) => {
    cred = {
        config : {
        'iceServers' : [
        {
            url: 'stun:global.stun.twilio.com:3478?transport=udp',
            urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
        },
        {
            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        },  
        //remove the below three objects if you are running locally without twilio 
        {
            url: 'turn:global.turn.twilio.com:3478?transport=udp',
            username : twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:3478?transport=tcp',
            username: twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:443?transport=tcp',
            username:twilioObj.username,
            urls: 'turn:global.turn.twilio.com:443?transport=tcp',
            credential: twilioObj.cred
        }
        ]} 
    };
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
     

    //const ENDPOINT = process.env.REACT_APP_API_ENDPOINT_LOCAL;   // the express server 
    const ENDPOINT = process.env.REACT_APP_API_ENDPOINT_REAL; // my deployed server 
    
    useEffect(() => {
        const { name, room } = queryString.parse(location.search); 
        socket = io(ENDPOINT, { transport : ['websocket'] });
        setName(name.trim().toLowerCase()); 
        setRoom(room.trim().toLowerCase());
        // setName(name);
        // setRoom(room); 

        socket.emit('join',{name,room},(result)=>{
            console.log(`You are ${name} with id ${socket.id}`); 
            setCredObj(result); 
            //console.log(cred); 
        });
        
        return () => { //component unmounting 
            socket.emit('leave-voice',{name,room},() => {});
            socket.emit('disconnect');
            socket.off(); 
        }
    },[ENDPOINT,location.search]); //[ENDPOINT,location.search]);  

    
    useEffect(()=>{
        socket.on('message',(messageReceived)=>{
            setMessages((messages)=>[...messages,messageReceived]); 
        });
        socket.on('usersinvoice-before-join',({users})=>{
            //console.log(users); 
            setUsersInVoice((usersInVoice) => users); 
        });       
        socket.on('users-online',({users})=>{
            setUsersOnline((usersOnline) => users); 
        }); 
        socket.on('add-in-voice',(user)=>{
            console.log(`New user in voice: ${user.name}`); 
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
                //peer = new Peer(socket.id);

                peer = new Peer(socket.id, cred);  
                console.log("Peer:", peer);
                
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

                    // won't call myself 
                    const otherUsersInVoice = (usersInVoice).filter((x) => x.id !== socket.id);  
                    
                    peers = (otherUsersInVoice).map((u) => {  // usersInVoice affects this 
                        //call everyone already present 
                        var mediaConnection = peer.call(u.id, mystream); 
                        console.log(`Calling ${u.id} ${u.name}`);
                        //console.log(mediaConnection); 
    
                        const audio = document.createElement('audio');
                        mediaConnection.on('stream', (stream)=>{
                            console.log(`${u.name} picked up call`)
                            audio.srcObject = stream
                            audio.addEventListener('loadedmetadata', () => {
                                audio.play()
                            })
                        });

                        // if anyone closes media connection 
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
        } 
        
        return ()=> {

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
        <div className="outerContainer bgprime">
            <div className="container bgsec">
                <InfoBar room={room}/> 
                <Messages messages={messages} name={name}/>
                <Input setMessage={setMessage} sendMessage={sendMessage} messageToSend={messageToSend} /> 
            </div>
            <div className="inMobile bgsec">
                    ...scoll down for more
            </div>
            <div className="container-right">
                <div className="container-up bgsec">
                    <InfoBarRight/> 
                    <People usersOnline={usersOnline} isVoice={false}/> 
                </div>
                <div className="container-down bgsec">  
                    <People usersOnline={usersInVoice} isVoice={true}/> 
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