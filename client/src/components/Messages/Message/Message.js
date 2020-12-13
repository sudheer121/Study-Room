import React from "react";
import "./Message.css";  

const Message = ({message:{user,text},name})=> {

    // const user = message.user;
    // const text = message.text; 

    let isSentByCurrentUser = false; 
    const trimmedName = name.trim().toLowerCase(); 

    if(user === trimmedName) { 
        isSentByCurrentUser = true; 
    } 

    return (
        isSentByCurrentUser 
        ? (
            <div className="messageContainer justifyEnd"> 
                <p className="sentText pr-10">{trimmedName}</p>
                <div className="messageBox backgroundMy"> <p className="messageText colorWhite">{ text }</p> </div> 
            </div> 
        )
        : (
             <div className="messageContainer justifyStart"> 
                <div className="messageBox backgroundMain"> <p className="messageText colorWhite">{ text }</p> </div> 
                <p className="sentText pl-10">{user}</p>
            </div> 
        )
    );

}

export default Message; 