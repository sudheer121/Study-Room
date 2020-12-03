import React,{ useState } from "react";
import Peer from "peerjs"; 
import "./Voice.css";

const Voice = ( { usersInVoice, joinVoice, leaveVoice, join, setJoin} ) => {

  
  const btnClick = () => {
      
      if(join) { 
        leaveVoice(); 
        setJoin(0); 
      } else {
        joinVoice();
        setJoin(1); 
      }
  }

  return (
    <div className="voicebox">
      <button className="voicebutton" onClick = { btnClick }> 
        {  join ? <p>Leave Voice</p> : <p>Join voice </p> } 
      </button>
    </div>
  );
};

export default Voice;
/*

        const peer = new Peer(socket,{
              host:'/',
              port: 5000,
              path: '/peerjs'
        }); //connect this peer to server

        usersOnline.forEach(  user => {
            if(user.id != socket) {
              console.log(user.id,socket);
              const conn = peer.connect(user.id); //calling other user
              conn.on('open', () => {             // when other user picks up 
                conn.send('hi! from' + socket); //send 
              });
            }
        });
        
        //recieve
        peer.on('connection', (conn) => {
          conn.on('data', (data) => {
            // Will print 'hi!'
            console.log(data);
          });
          conn.on('open', () => {
            conn.send('hello!' + socket);
          });
        });

*/
