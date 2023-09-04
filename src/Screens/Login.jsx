import React, {  useState }from 'react'
import { Link, useNavigate } from 'react-router-dom'
import  '../styles/styles.css'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/authSlice'


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
    // Effectuer des actions de connexion, comme envoyer les données au serveur
    // console.log('Email:', email);
    // console.log('Mot de passe:', password);


    const clientData = {
      email,
      password
  }
  
  try{
    //appel axios pour se loger
    // const res = await axios.post('http://localhost:8080/login', clientData)
    const res = await axios.post(`${baseUrl}/login`, clientData)

    // console.log('token', res.data.token)
    // console.log('login reussi')
    const user = res.data.user
    console.log('user login', user)
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
      <div className='login_container'>
        <div className='login_formulaire'>
          <h2>Veuillez vous connecter</h2>
            <form onSubmit={handleSubmit} className='formulaire_login'>
              <div className='inputOptions'>
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='inputOptions'>
                <label htmlFor="password">Mot de passe:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" >Se connecter</button>
            </form>
            <div>
              Pas encore inscrit ?
              <Link to="/signup"> S'inscrire </Link>
            </div>
        </div>
      </div>
</div>
  )
}
