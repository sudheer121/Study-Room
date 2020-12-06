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
        {  join ? <p>Leave Voice</p> : <p>Join voice </p> } 
      </button>
    </div>
  );
};

export default Voice;
