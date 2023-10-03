import React, {  useState} from 'react'
import { useSelector } from 'react-redux'

import  DashboardPage  from '../componants/DashboardPage'
import ProduitsPage from '../componants/ProduitsPage'
import UsersPage from '../componants/UsersPage'
import Promos from '../componants/Promos'
import CommandePageSimple from '../componants/CommandePage2'
import  MaBoulangerie from '../componants/MaBoulangerie'
import  ClickandCollect  from '../componants/ClickandCollect'
import AntiGaspi from '../componants/AntiGaspi'
import  '../styles/home.css'
import  logo  from '../assets/logo_menu.png'


const Home = () => {

 const [currentPage, setCurrentPage] = useState(null);
 const [isClicked, setIsClicked] = useState(false);


 const user = useSelector((state) => state.auth.user)

 //selection page visible suivant le bouton cliqué
 const handleContentSelection = (page) => {
  setCurrentPage(page);
};

  return (
    <div className='home_container'>
     
     <div className='profil'>
        {/* {
          user && <h2>Bienvenue {user.firstname}</h2>
        } */}
        <div className='nav'>
        <img src={logo} alt="" /> 
        {
           <div className='nav'>{currentPage}</div>
           
        }
        </div>
        
     </div>
      <div className='dashboard_container'>
        <div className='dashboard_menu'>
          {/* boutons de navigation */}
            <button onClick={() => handleContentSelection("dashboard")} 
                  className={currentPage === 'dashboard' ? 'button_menu_clicked' : 'button_menu'}
                  >Dashboard</button>
            {
              user.role === 'gestionnaire' &&  <button onClick={() => handleContentSelection("produits")} 
              className={currentPage === 'produits'? 'button_menu_clicked' : 'button_menu'}
              >Produits</button>
            }
           
            
            {
              user.role === 'gestionnaire' && <button onClick={() => handleContentSelection("clickandcollect")} 
              className={currentPage === 'clickandcollect'? 'button_menu_clicked' : 'button_menu'}
              >ClickandCollect</button>
            }
            <button onClick={() => handleContentSelection("antigaspi")} 
            className={currentPage === 'antigaspi'? 'button_menu_clicked' : 'button_menu'}
            >AntiGaspi</button>
            <button onClick={() => handleContentSelection("users")} 
            className={currentPage === 'users'? 'button_menu_clicked' : 'button_menu'}
            >Clients</button>
            <button onClick={() => handleContentSelection("commandes")} 
            className={currentPage === 'commandes'? 'button_menu_clicked' : 'button_menu'}
            >Commandes</button>
            <button onClick={() => handleContentSelection("promos")} 
            className={currentPage === 'promos'? 'button_menu_clicked' : 'button_menu'}
            >Promotions</button>
            <button onClick={() => handleContentSelection("boulangerie")} 
            className={currentPage === 'boulangerie'? 'button_menu_clicked' : 'button_menu'}
            >Ma boulangerie</button>
        </div>
        <div className='dashboard_content'>
              
              { currentPage === "dashboard" && <DashboardPage />}
              { currentPage === "produits" && <ProduitsPage />}
              { currentPage === "clickandcollect" && <ClickandCollect />}
              { currentPage === "antigaspi" && <AntiGaspi />}
              { currentPage === "users" && <UsersPage />}
              { currentPage === "commandes" && <CommandePageSimple />}
              { currentPage === "promos" && <Promos />}
              { currentPage === "boulangerie" && <MaBoulangerie />}
              {/* Autres pages ici */}
         
          </div>
      </div>
    </div>
  )
}
export default Home