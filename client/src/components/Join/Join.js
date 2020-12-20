import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";
import readingBook from "../../icons/readingBook.svg"; 
// import InfoComponent from "./components/InfoComponent"
// import FormComponent from "./components/FormComponent";

const Join = () => {
  
  const [viewInfo, setViewInfo] = useState(0); 
  const toggle = () => { setViewInfo(!viewInfo); }

  const FormComponent = ()=> {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    return (<div>
      <div>
        <input
          placeholder="Name"
          className="joinInput bgtert"
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="Room"
          className="joinInput mt-20 bgtert"
          type="text"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
      </div>
      <Link
        onClick={(e) => (!room || !name) && e.preventDefault()}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button className="button mt-20 fontprime bgbutton" type="submit">
          Sign In
        </button>
      </Link>
      <p className="helpbutton" onClick={ toggle }> Help / How to use </p>
  </div>)
  }

  const InfoComponent = ()=> {
    return (<div className="helptext ">
      <p> 
        <u>How to use</u> : Choose a unique room ID by yourself and share with your friends.
        Join the room and study together using text and voice channels. 
        No registration required. 
      </p> 
      <p>
        <u>Info</u> : The application aims to put text and voice channels on the same page, so 
        that collaboration with friends while studying becomes easy. 
      </p>
      <div style={ {display:"flex", justifyContent:"space-between" }}> 
        <a style={{ color:"grey" }} target="blank" href="https://www.linkedin.com/in/sudheer-tripathi-384239147/"> Meet me here </a>
        <span onClick={toggle} style={{ marginRight:0, color:"#7289dA"}}> <u> Back</u> </span>
      </div>
    </div>)
  } 
  return (
    <div className="joinOuterContainer bgprime">      
      <img className="bookIcon" src={readingBook} alt="."></img>
      <div className="joinInnerContainer bgsec">
        <h1 className="chatHeading"> Study Room </h1>
        { viewInfo ? ( <InfoComponent /> ) : <FormComponent /> }
      </div>
    </div>
  );
};

export default Join;


/*
Link tag sends the data to /room 
*/
