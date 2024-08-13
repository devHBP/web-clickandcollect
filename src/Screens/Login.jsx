import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/authSlice";
import logo from "../assets/logo_pdj.png";

import axios from "axios";

export const Login = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  //const baseUrl = "http://localhost:8080"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      email,
      password,
    };

    try {
      const res = await axios.post(`${baseUrl}/login`, clientData);
      localStorage.setItem("userToken", JSON.stringify(res.data.token));
      const user = res.data.user;
      dispatch(loginUser(user));
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login">
      <div className="login_formulaire">
        <img src={logo} alt="" width="150px" />
        <form onSubmit={handleSubmit} className="formulaire_login">
          <div className="inputOptions">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
            />
          </div>
          <div className="inputOptions">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>
          <div className="bloc_login">
            <button type="submit" className="button">
              Connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
