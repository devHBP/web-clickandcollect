import  Home  from "./Screens/Home";
import { Login } from "./Screens/Login";
import { Signup } from "./Screens/Signup";
import { Accueil } from "./Screens/Accueil";
import Navbar from "./componants/Navbar"
import { Routes, Route } from 'react-router-dom';
import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from './reducers/authSlice';
import axios from 'axios';

function App() {

  

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)


  return (
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" Component={Accueil}/> */}
        <Route path="/" Component={Login}/> 
        <Route path="/signup" Component={Signup}/>
        {
          isLoggedIn && <Route path="/home" Component={Home}/>
        }
      </Routes>

    </div>
    
  )
}

export default App
