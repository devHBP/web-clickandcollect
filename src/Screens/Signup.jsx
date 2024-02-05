import React, {  useState }from 'react'
import { Link, useNavigate} from 'react-router-dom'
import  '../styles/styles.css'
import { useDispatch } from 'react-redux'
import { registerUser } from '../reducers/authSlice'

import axios from 'axios'

export const Signup = () => {
  const [lastname, setLastName] = useState('')
  const [firstname, setFirstName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const clientData = {
      lastname,
      firstname, 
      email,
      password,
      //ajout
      //modif ici id_magasin:null au lieu de vide ('')
       storeId:null
  }
  // console.log('signup web', clientData)
  try{
    //appel axios pour se loger
    const res = await axios.post('http://localhost:8080/signup', clientData)
    // console.log("user créé : ", res.config.data)
    // console.log('client data créé', clientData)
    const user = { firstname, lastname, email, password}
    dispatch(registerUser(user))
    navigate('/')
    
  }catch (error){
      console.log(error)
  }

    // Réinitialiser les champs du formulaire
    setEmail('');
    setPassword('');
  
}

  return (
    <div className='login'>
      <div className='login_container'>
        <div className='login_formulaire'>
          <h2>Veuillez remplir les champs suivants</h2>
          <h2>pour vous inscrire</h2>
            <form onSubmit={handleSubmit} className='formulaire_login'>
              <div className='inputOptions'>
                <label htmlFor="lastname">Nom:</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Nom'
                />
              </div>
              <div className='inputOptions'>
                <label htmlFor="firstname">Prénom:</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='Prénom'
                />
              </div>
              <div className='inputOptions'>
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email'
                />
              </div>
              <div className='inputOptions'>
                <label htmlFor="password">Mot de passe:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Mot de passe'
                />
              </div>
              <button type="submit" >S'inscrire</button>
            </form>
            <div>
              Vous êtes déja inscrit ?
              <Link to="/"> Se connecter </Link>
            </div>
        </div>
      </div>
    </div>
  )
}
