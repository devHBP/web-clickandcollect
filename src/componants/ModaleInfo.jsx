import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"; // Icônes pour l'état coché/non-coché

const ModaleInfo = ({ setOpenModaleInfo, userName, prefAlim, allergies }) => {

    // revoir les etats avec une requete pour recuperer les infos sur le profil du user
  const [productReplacement, setProductReplacement] = useState(false);
  const [discount, setDiscount] = useState(false);
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
              {productReplacement ? <FaCheckSquare /> : <FaRegSquare />}
              <span> Produit de remplacement</span>
            </li>
            <li className="liModaleInfo">
              {discount ? <FaCheckSquare /> : <FaRegSquare />}
              <span> Avoir - Réduction</span>
            </li>
              
       
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModaleInfo;
