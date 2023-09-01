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

const Home = () => {

 const [currentPage, setCurrentPage] = useState(null);

 const user = useSelector((state) => state.auth.user)

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
            {
              user.role === 'gestionnaire' &&  <button onClick={() => handleContentSelection("produits")}>Produits</button>
            }
           
            
            {
              user.role === 'gestionnaire' && <button onClick={() => handleContentSelection("clickandcollect")}>ClickandCollect</button>
            }
            <button onClick={() => handleContentSelection("antigaspi")}>AntiGaspi</button>
            <button onClick={() => handleContentSelection("users")}>Clients</button>
            <button onClick={() => handleContentSelection("commandes")}>Commandes</button>
            <button onClick={() => handleContentSelection("promos")}>Promotions</button>
            <button onClick={() => handleContentSelection("boulangerie")}>Ma boulangerie</button>
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