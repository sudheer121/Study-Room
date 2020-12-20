import React from "react"; 

import { BrowserRouter as Router, Route } from "react-router-dom"; 

import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat"; 
import "./main.css"

const App = () => { 
    
    return ( 
            <Router> 
                <Route path="/" exact component={Join} />
                <Route path="/chat" exact component={Chat} /> 
            </Router>
    ); 
}

export default App; 

/* User enters data in "/", that data is passed to "/chat" using query-strings" */ 