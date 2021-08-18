import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GenerateRoom from "./GenerateRoom/GenerateRoom";
import queryString from "query-string";
import "./Join.css";
import readingBook from "../../icons/readingBook.svg"; 
// import InfoComponent from "./components/InfoComponent"
// import FormComponent from "./components/FormComponent";

const Join = ({location}) => {
  
  const [state, setState] = useState(2); 
  const toggle = (x) => { setState(x) }

  useEffect(()=>{
    console.log(location.pathname)
    if(location.pathname === "/join") { 
      setState(0)
    }
  },[location]);

  const FormComponent = ()=> {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    useEffect(()=>{
      console.log(location.pathname)
      if(location.pathname === "/join") {
        const {roomId} = queryString.parse(location.search); 
        console.log(roomId)
        if(roomId !== ""){
          console.log(roomId); 
          setRoom(roomId); 
        }
      }
    },[]);
    
    return (<div>
      <div>
        <input
          placeholder="Your name"
          className="joinInput bgtert"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="Room"
          className="joinInput mt-20 bgtert"
          value={room}
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
          Join
        </button>
      </Link>
      <div style={{textAlign:"left", fontSize:"2rem"}} className="mt-20"> 
        <span onClick={() => { toggle(2) }} style={{ marginRight:0, color:"#7289dA"}}> <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> </span>
      </div>
  </div>)
  }

  const GenerateRoomOrJoinRoom = () => {
    return (
      <>
        <button className="button mt-20 fontprime bgbutton" type="submit" onClick = {()=>{toggle(3)}}>
          Generate  Room
        </button> 
        <button className="button mt-20 fontprime bgbutton" type="submit" onClick = {()=>{toggle(0)}}>
          Join existing Room 
        </button>
        <p className="helpbutton" onClick={ () => { toggle(1) } }>
          <i className="fa fa-question-circle" aria-hidden="true"></i>
        </p>
      </>
    )
  }

  const InfoComponent = ()=> {
    return (<div className="helptext ">
      <p> 
        <u>How to use</u> : 
        <ul> 
          <li>Generate a room ID by clicking generate room button</li>
          <li>Click <i className="fa fa-share-alt" aria-hidden="true"></i> for sharing join link with friends.</li>
          <li>Click <i className="fa fa-clone" aria-hidden="true"></i> for copying room ID</li>
          <li>Join the room and study together using text and voice channels. No registration required. </li>
        </ul>
         
      </p> 
      <p>
        <u>About</u> : The application aims to put text and voice channels on the same page, so 
        that collaboration with friends while studying becomes easy. 
      </p>
      <div style={ {display:"flex", justifyContent:"space-between", fontSize:"2rem"}}> 
        <span onClick={() => { toggle(2) }} style={{ marginRight:0, color:"#7289dA"}}> <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> </span>
        <a style={{ color:"grey",fontSize:"1.5rem" }} target="blank" href="https://www.linkedin.com/in/sudheer-tripathi-384239147/"> Meet me </a>
      </div>
    </div>)
  } 

  const getAppropriateComponent = (num) => {
    if(num === 0) {
      return <FormComponent /> 
    }
    if(num === 1) {
      return <InfoComponent /> 
    }
    if(num === 2) {
      return <GenerateRoomOrJoinRoom /> 
    }
    if(num === 3) {
      return <GenerateRoom toggle={toggle}/> 
    }
    return <></>  
  }

  return (
    <div className="joinOuterContainer bgprime">      
      <div className="joinInnerContainer bgsec">
        <img className="bookIcon" src={readingBook} alt="."></img>
        <h1 className="chatHeading" onClick={()=>{setState(2)}}> Study Room </h1>
        <div className="belowHeading"> 
          {getAppropriateComponent(state)}
        </div>
      </div>
    </div>
  );
};

export default Join;


/*
Link tag sends the data to /room 
*/
