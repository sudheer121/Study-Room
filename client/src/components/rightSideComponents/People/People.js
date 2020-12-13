import React from "react";
import "./People.css";
import Person from "./Person/Person"; 
const People = ({usersOnline, isVoice}) => {

    return ( 
        <div className="people">
        { usersOnline.map((user,i) => <Person key={i} person={user} isVoice={isVoice}/> )}
        </div>
    ); 
}

export default People; 