import React, { useState, useEffect } from "react";
import logo from '../assets/logo.png';
import axios from "axios";
import { Modal } from "antd";
import { AiOutlineEdit } from "react-icons/ai";

const MaBoulangerie = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [store, setStore] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storeEdit, setStoreEdit] = useState({});

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    setStoreEdit(store);
  }, [store]);

  const fetchStores = async () => {
    try {
      const storeResponse = await axios.get(`${baseUrl}/getOneStore/20`);
      const storeData = storeResponse.data;
      setStore(storeData);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations :", error);
    }
  };

  const update = () => {
    setIsModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreEdit(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${baseUrl}/updateStore/20`, storeEdit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setStore(response.data.store);
        setIsModalVisible(false);
      } else {
        console.error("La mise à jour du magasin n'a pas renvoyé de données mises à jour.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du magasin :", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='boulangerie_content'>
      <h2>Ma boulangerie</h2>
      <div className='boulangerie_details'>
        <img src={logo} alt="logo pain du jour" className='imageBoulangerie'/>
        <div className="infos">
          <p>Nom : {store.nom_magasin}</p>
          <p>Adresse : {store.adresse_magasin}, {store.cp_magasin} {store.ville_magasin}</p>
          <p>Téléphone : 04 68 84 46 01</p>
          <p>Horaires :</p>
          <table>
            <tr>
              <td><span className="days">Lundi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Mardi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Mercredi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Jeudi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Vendredi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Samedi:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
            <tr>
              <td><span className="days">Dimanche:</span></td>
              <td>{store.heure_ouverture} - {store.heure_fermeture}</td>
            </tr>
          </table>
        </div>

        <div className="editIcon">
        <AiOutlineEdit onClick={update} />
        </div>
        
        <Modal
          title="Modifications"
          open={isModalVisible} 
          onCancel={handleCancel}
          onOk={handleUpdate}
          className="modaleInfos"
        >
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modalDetails">
                <label htmlFor="nom_magasin" className="labelModal">Nom du magasin:</label>
                <input
                  type="text"
                  id="nom_magasin"
                  name="nom_magasin"
                  value={storeEdit.nom_magasin || ''}
                  onChange={handleInputChange}
                  style={{width: "300px"}}
                />
              </div>
             
              <div className="modalDetails">
                <label htmlFor="adresse_magasin" className="labelModal">Adresse du magasin:</label>
                <input
                  type="text"
                  id="adresse_magasin"
                  name="adresse_magasin"
                  value={storeEdit.adresse_magasin || ''}
                  onChange={handleInputChange}
                  style={{width: "300px"}}
                />
              </div>
              <div className="modalDetails">
                <label htmlFor="heure_ouverture" className="labelModal">Heures d'ouverture:</label>
                <input
                  type="text"
                  id="heure_ouverture"
                  name="heure_ouverture"
                  value={storeEdit.heure_ouverture || ''}
                  onChange={handleInputChange}
                  style={{width: "300px"}}
                />
              </div>
              <div className="modalDetails">
                <label htmlFor="heure_fermeture" className="labelModal">Heures de fermeture:</label>
                <input
                  type="text"
                  id="heure_fermeture"
                  name="heure_fermeture"
                  value={storeEdit.heure_fermeture || ''}
                  onChange={handleInputChange}
                  style={{width: "300px"}}
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default MaBoulangerie;
