import React from "react";
import "./Person.css"; 

const Person = ( {person, isVoice} )=> {
    return (
        <div className = "namecontainer backgroundMain">
            <div className="person">
            {person.name + "  "} 
            { isVoice && <i class="fas fa-volume-up"></i> }
            </div>
        </div>
    ); 
}

export default Person;