import React from "react";
import "./People.css";
import Person from "./Person/Person"; 
const People = ({usersOnline}) => {

    return ( 
        <div className="people">
        { usersOnline.map((user,i) => <Person key={i} person={user} /> )}
        </div>
    ); 
}

export default People; 