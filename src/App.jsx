import Home from "./Screens/Home";
import { Login } from "./Screens/Login";
import { Signup } from "./Screens/Signup";

import { Routes, Route } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signup" Component={Signup} />
        {isLoggedIn && <Route path="/home" Component={Home} />}
      </Routes>
    </div>
  );
}

export default App;
