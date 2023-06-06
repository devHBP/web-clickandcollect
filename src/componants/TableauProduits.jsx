import React, { useState} from 'react';
import { AiOutlineRest, AiOutlineReload} from "react-icons/ai";
import axios from 'axios'
import ModaleDelete from './ModaleDelete';
import ModaleUpdate from './ModaleUpdate';

const TableauProduits = ({ elements, handleDelete, handleUpdateProduct }) => {
  // console.log('elements', elements)

  //modal delete
  const [openModaleDelete, setOpenModaleDelete] = useState(false)
  const [openModaleUpdate, setOpenModaleUpdate] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null);


  const handleUpdate = (id_produit, updatedData) => {
    handleUpdateProduct(updatedData, id_produit ); // Appel de la fonction handleUpdate du composant parent avec les données mises à jour
  };
  const handleConfirmUpdate = (updatedData) => {
    handleUpdate(selectedProductId, updatedData);
    setOpenModaleUpdate(false);
  };
  

  //serveur nodeJS
  const baseUrl = "http://127.0.0.1:8080"
  return (
    <>
    <table className='table_produits'>
      <thead>
        <tr>
          <th className='colomn_photo'>Photo</th>
          <th>Libellé</th>
          <th>Catégorie</th>
          <th>Prix</th>
          <th className='colomn_actions'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {elements.map((produit, index) => (
          <tr key={produit.id_produit}>
            <td>
              {/* <img src={element.image} alt={element.libelle} /> */}
              <img src={`${baseUrl}/${produit.image}`} alt={produit.libelle} />
            </td>
            <td>{produit.libelle}</td>
            <td>{produit.categorie}</td>
            <td>{produit.prix} €</td>
            <td className='actions'>
                <AiOutlineReload className='icones_actions' onClick={() => {
                  setSelectedProductId(produit.id_produit);
                  setOpenModaleUpdate(true)
                }}/>
                {/* <AiOutlineRest className='icones_actions' onClick={() => handleDelete(produit.id_produit)}/> */}
                <AiOutlineRest className='icones_actions' onClick={() => {
                  setSelectedProductId(produit.id_produit)
                  setOpenModaleDelete(true)}
                }/>
            </td>
          </tr>
        ))}
         
      </tbody>
    </table>
    {
      openModaleDelete && 
      (<ModaleDelete setOpenModaleDelete={setOpenModaleDelete} handleDelete={handleDelete} id_produit={selectedProductId} />)
    }
    {
      openModaleUpdate && 
      (<ModaleUpdate setOpenModaleUpdate={setOpenModaleUpdate} handleConfirmUpdate={handleConfirmUpdate} id_produit={selectedProductId} />)
    }

    </>
  );
};

export default TableauProduits
