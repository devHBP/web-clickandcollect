import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../reducers/authSlice";
import DashboardPage from "../componants/DashboardPage";
import ProduitsPage from "../componants/ProduitsPage";
import UsersPage from "../componants/UsersPage";
import Promos from "../componants/Promos";
import CommandePageSimple from "../componants/CommandePage2";
import MaBoulangerie from "../componants/MaBoulangerie";
import ClickandCollect from "../componants/ClickandCollect";
import AntiGaspi from "../componants/AntiGaspi";
import "../styles/styles.css";
import logo from "../assets/logo_menu.png";
import Resume from "../componants/Resume";
import axios from "axios";

const Home = () => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user.role;
  // const [currentPage, setCurrentPage] = useState("produits");
  //acces restreint pour les employée
  const [currentPage, setCurrentPage] = useState(
    userRole === "gestionnaire" ? "produits" : "antigaspi"
  );

  // Fonction pour récupérer le compteur de nouvelles commandes
  const fetchNewOrdersCount = async () => {
    const baseUrl = import.meta.env.VITE_REACT_API_URL;
    try {
      const response = await axios.get(`${baseUrl}/ordersInWebApp`);
      const orders = response.data.orders;
    
      const newOrdersCount = orders.filter(
        (order) => !order.view 
      ).length;
      // console.log('orders', orders)
      setNewOrdersCount(newOrdersCount);
    } catch (error) {
      console.error("Erreur lors du chargement des nouvelles commandes", error);
    }
  };

  useEffect(() => {
    fetchNewOrdersCount();
    const intervalId = setInterval(fetchNewOrdersCount, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const updateNewOrdersCount = (count) => {
    setNewOrdersCount(count);
  };
  //selection page visible suivant le bouton cliqué
  const handleContentSelection = (page) => {
    setCurrentPage(page);
  };
  const pageNames = {
    dashboard: "Dashboard",
    produits: "Produits",
    clickandcollect: "Click and Collect",
    antigaspi: "AntiGaspi",
    users: "Clients",
    commandes: "Commandes",
    recapitulatif: "Récapitulatif",
    promos: "Promotions",
    boulangerie: "Ma Boulangerie",
  };

  //deconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="home_container">
      <div className="profil">
        {/* {
          user && <h2>Bienvenue {user.firstname}</h2>
        } */}
        <div className="nav">
          <img src={logo} alt="" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            {<div className="currentPage">{currentPage}</div>}
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              Accueil {">"} {pageNames[currentPage]}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard_container">
        <div className="dashboard_menu">
          {/* boutons de navigation */}
          <button
            onClick={() => handleContentSelection("dashboard")}
            className={
              currentPage === "dashboard"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            Dashboard
          </button>
          {user.role === "gestionnaire" && (
            <button
              onClick={() => handleContentSelection("produits")}
              className={
                currentPage === "produits"
                  ? "button_menu_clicked"
                  : "button_menu"
              }
            >
              Produits
            </button>
          )}

          {user.role === "gestionnaire" && (
            <button
              onClick={() => handleContentSelection("clickandcollect")}
              className={
                currentPage === "clickandcollect"
                  ? "button_menu_clicked"
                  : "button_menu"
              }
            >
              ClickandCollect
            </button>
          )}
          <button
            onClick={() => handleContentSelection("antigaspi")}
            className={
              currentPage === "antigaspi"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            AntiGaspi
          </button>
          <button
            onClick={() => handleContentSelection("users")}
            className={
              currentPage === "users" ? "button_menu_clicked" : "button_menu"
            }
          >
            Clients
          </button>
          {/* <button
            onClick={() => handleContentSelection("commandes")}
            className={
              currentPage === "commandes"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            Commandes
          </button> */}
          <button
            onClick={() => handleContentSelection("commandes")}
            className={
              currentPage === "commandes"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            Commandes <span className="badge">{newOrdersCount}</span>
            {/* Commandes {<span className="badge">X</span>} */}
          </button>
          <button
            onClick={() => handleContentSelection("recapitulatif")}
            className={
              currentPage === "recapitulatif"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            Résumé
          </button>
          {user.role === "gestionnaire" && (
          <button
            onClick={() => handleContentSelection("promos")}
            className={
              currentPage === "promos" ? "button_menu_clicked" : "button_menu"
            }
          >
            Promotions
          </button>
          )}
          <button
            onClick={() => handleContentSelection("boulangerie")}
            className={
              currentPage === "boulangerie"
                ? "button_menu_clicked"
                : "button_menu"
            }
          >
            Ma boulangerie
          </button>
          <button onClick={handleLogout} className="button_menu">
            Déconnexion
          </button>
        </div>
        <div className="dashboard_content">
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "produits" && <ProduitsPage />}
          {currentPage === "clickandcollect" && <ClickandCollect />}
          {currentPage === "antigaspi" && <AntiGaspi />}
          {currentPage === "users" && <UsersPage />}
          {/* {currentPage === "commandes" && <CommandePageSimple />} */}
          {currentPage === "commandes" && (
            <CommandePageSimple updateNewOrdersCount={updateNewOrdersCount} />
          )}
          {currentPage === "recapitulatif" && <Resume />}
          {currentPage === "promos" && <Promos />}
          {currentPage === "boulangerie" && <MaBoulangerie />}
          {/* Autres pages ici */}
        </div>
      </div>
    </div>
  );
};
export default Home;
