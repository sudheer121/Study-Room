<h2> Study-Room (connect over text and voice channels) </h2>
Study, collaborate, conference ... over click of a button. 
A fully functional web application where students can join in room, and communicate in text and audio channels.The application connects peers using webSockets and webRTC. 
Check it out at https://mystudyroom.netlify.app  

<h3> <u>Desktop and Mobile Views</u> </h3>

<div align="center"> 
  <div>
    
    The application is compatible with both desktop and mobile phones. 
    
  </div> 
  <div>
    <img src="https://i.imgur.com/x75zSa3.gif" width="720" height="400"/>
    <img src="/zgifs/mobile-view.gif" width="200" height="400"/>
  </div> 
</div>

<h3> Features </h3>

> <ul> 
> <li> Chat using text and voice channels </li>
> <li> Easy to use UI with everything on one screen</li>
> <li> Mobile Compatibility </li> 
> <li> Connect with multiple people by choosing unique room ids</li> 
> </ul>
  
<h3> Technologies Used </h3>

> <ul> 
> <li> Server - Nodejs </li>
> <li> Client - Reactjs </li>
> <li> Chat - WebSockets </li>
> <li> Voice - WebRTC </li> 
> </ul>

<h3> Technology Preview </h3> 

> What's the best application level protocol for enabling a bidirectional communication channel(i.e both client and server can update each other at any time) ?. HTTP works fine when the client has to request data fewer times. HTTP opens up a connection and closes the connection as soon as it gets required response. In case of a chat application we continuously need to listen for data from server, one solution is keep requesting the server for data every few milliseconds, but its resource consuming for both the sides. The solution is WebSockets, it enables a full-duplex bidirectional communication, that is, the client is always ready to listen for data pushed by server. 
But WebSockets are still not peer to peer, in case of audio/video streaming between multiple peers, creating a direct peer to peer connection is a better option (because loads of data is being streamed), but this is also one of the most difficult things to do. WebRTC helps us create a direct peer to peer connetion. WebRTC is one of the most complex communication protocols because it tries all possible ways to create a peer - peer connection, if it still fails then the data is relayed via a TURN server. 

