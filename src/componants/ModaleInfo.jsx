import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"; 
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_API_URL;

const ModaleInfo = ({
  setOpenModaleInfo,
  userName,
  prefAlim,
  allergies,
  userId,
}) => {
  const [prefCommande, setPrefCommande] = useState(null);

  useEffect(() => {
    getInfoUser();
  }, []);

  const getInfoUser = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/getInfoPrefCommande/${userId}`
      );
      // console.log('response', response.data.preference_commande)
      setPrefCommande(response.data.preference_commande);
    } catch (error) {
      console.error(
        "An error occurred while updating the order status:",
        error
      );
    }
  };

  return (
    <div className="modale_container">
      <div className="modale">
        <div className="contentTitleModale">
          <p className="title_modale">Information pour {userName} </p>
          <AiFillCloseCircle
            className="button_close"
            onClick={() => setOpenModaleInfo(false)}
          />
        </div>

        <h3> Les choix alimentaires du client</h3>
        <div className="listAlimentaire">
          <ul className="ulModaleInfo">
            <li className="liModaleInfo">
              Préference alimentaires : {prefAlim}
            </li>
            <li className="liModaleInfo">Allergies : {allergies}</li>
          </ul>
        </div>

        <h3>Les préférences du client en cas de rupture de stock</h3>
        <div className="listAlimentaire">
          <ul className="ulModaleInfo">
            <li className="liModaleInfo">
              {prefCommande === "remplacement" ? (
                <FaCheckSquare />
              ) : (
                <FaRegSquare />
              )}
              <span> Produit de remplacement</span>
            </li>
            <li className="liModaleInfo">
              {prefCommande === "remboursement" ? (
                <FaCheckSquare />
              ) : (
                <FaRegSquare />
              )}
              <span> Remboursement</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModaleInfo;
