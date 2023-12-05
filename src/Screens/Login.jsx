import React, {  useState }from 'react'
import { Link, useNavigate } from 'react-router-dom'
import  '../styles/styles.css'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/authSlice'
import logo from "../assets/logo_pdj.png"

import axios from 'axios'

export const Login = () => {

  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Email:', email);
    // console.log('Mot de passe:', password);

    const clientData = {
      email,
      password
  }
  
  try{
    //appel axios pour se logger
    // const res = await axios.post('http://localhost:8080/login', clientData)
    const res = await axios.post(`${baseUrl}/login`, clientData)

    // console.log('token', res.data.token)
    const user = res.data.user
    // console.log('user login', user.role)
    dispatch(loginUser(user))
    navigate('/home')
      // // Réinitialiser les champs du formulaire
      // setEmail('');
      // setPassword('');
  }catch (error){
      console.log(error)
  }

  
  }
  return (
    <div className='login'>
        <div className='login_formulaire'>
          <img src={logo} alt="" width="150px"/>
            <form onSubmit={handleSubmit} className='formulaire_login'>
              <div className='inputOptions'>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Votre email'
                />
              </div>
              <div className='inputOptions'>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Mot de passe'
                />
               
              </div>
              <div className='bloc_login'>
             
                  <button type="submit" className='button'>Connexion</button>
              </div>
           
            </form>  
            
        </div>
</div>
  )
}
