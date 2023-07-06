import React, {  useState} from 'react'
import { useSelector } from 'react-redux'

import  DashboardPage  from '../componants/DashboardPage'
import ProduitsPage from '../componants/ProduitsPage'
import UsersPage from '../componants/UsersPage'
import CommandePage from '../componants/CommandePage'
import Promos from '../componants/Promos'
import CommandePageSimple from '../componants/CommandePage2'
import { MaBoulangerie } from '../componants/MaBoulangerie'

export const Home = () => {

 const [currentPage, setCurrentPage] = useState(null);

 const user = useSelector((state) => state.auth.user)
//  console.log('user', user)

 //selection page visible suivant le bouton cliqué
 const handleContentSelection = (page) => {
  setCurrentPage(page);
};

  return (
    <div className='home_container'>
     
     <div className='profil'>
        {
          user && <h2>Bienvenue {user.firstname}</h2>
        }
     </div>
      <div className='dashboard_container'>
        <div className='dashboard_menu'>
          {/* boutons de navigation */}
            <button onClick={() => handleContentSelection("dashboard")}>Dashboard</button>
            <button onClick={() => handleContentSelection("produits")}>Produits</button>
            <button onClick={() => handleContentSelection("users")}>Clients</button>
            <button onClick={() => handleContentSelection("commandes")}>Commandes</button>
            <button onClick={() => handleContentSelection("commandes2")}>Commandes2</button>
            <button onClick={() => handleContentSelection("promos")}>Promotions</button>
            <button onClick={() => handleContentSelection("boulangerie")}>Ma boulangerie</button>
        </div>
        <div className='dashboard_content'>
              
              {currentPage === "dashboard" && <DashboardPage />}
              {currentPage === "produits" && <ProduitsPage />}
              { currentPage === "users" && <UsersPage />}
              { currentPage === "commandes" && <CommandePage />}
              { currentPage === "commandes2" && <CommandePageSimple />}
              { currentPage === "promos" && <Promos />}
              { currentPage === "boulangerie" && <MaBoulangerie />}
              {/* Autres pages ici */}
         
          </div>
      </div>
    </div>
  )
}
