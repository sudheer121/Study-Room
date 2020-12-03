import React from "react";
import "./Person.css"; 

const Person = ( {person} )=> {
    return (
        <div className = "namecontainer">
            <div className="person">
            {person.name}
            </div>
        </div>
    ); 
}

export default Person;