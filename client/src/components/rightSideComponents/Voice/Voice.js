import React from "react"; 
import "./Voice.css";

const Voice = ( { joinVoice, leaveVoice, join, setJoin} ) => {

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
        {  join ? 
        <p>Leave Voice <i className="fas fa-2x fa-microphone-slash"></i></p> : <p>Join Voice <i className="fas fa-2x fa-microphone voiceicon"></i></p> } 
      </button>
    </div>
  );
};

export default Voice;
