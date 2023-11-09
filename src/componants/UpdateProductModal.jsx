import React, { useState, useEffect } from 'react';
import { Modal, Input, Select } from 'antd';

const UpdateProductModal = ({
  visible,
  setVisible,
  product,
  categories,
  onUpdateProduct
}) => {
  const [libelle, setLibelle] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [prix, setPrix] = useState('');
  const [prixCollab, setPrixCollab] = useState('');

  useEffect(() => {
    // console.log('Produit à mettre à jour :', product);

    if (product) {
      setLibelle(product.libelle || '');
      setSelectedCategorie(product.categorie || '');
      setPrix(product.prix_unitaire || '');
      setPrixCollab(product.prix_remise_collaborateur || '');
    }
  }, [product]);

  const handlePrixUnitaire = (e) => {
    const value = e.target.value;
    setPrix(value.replace(',','.'))
}
const handlePrixCollaborateur = (e) => {
    const value = e.target.value;
    setPrixCollab(value.replace(',','.'))
}

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    // console.log('Soumission du produit avec ID :', product?.productId);

    const updatedData = {
      libelle,
      categorie: selectedCategorie,
      prix_unitaire: prix,
      prix_remise_collaborateur: prixCollab
    };
    if (!product) {
      console.error('Erreur : aucun produit sélectionné pour la mise à jour.');
      return; 
    }
    onUpdateProduct(product.productId, updatedData);
    setVisible(false);
  };

  return ( 
    <Modal 
          width={800}
          title="Modification du produit"
          open={visible}
          onCancel={() => setVisible(false)} 
          onOk={handleSubmit}
          okText="Save" 
          maskStyle={{ backgroundColor: 'lightgray' }} 
          >
            <div className='inputOptions'>
                    <label htmlFor="libelle">Libellé:</label>
                    <Input
                    type="text"
                    id="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    />
                </div>
                <div className="inputOptions">
                    <label htmlFor="categorie">Sélectionner une catégorie:</label>
                    <Select id="categorie" value={selectedCategorie} onChange={(e) => setSelectedCategorie(e.target.value)}>
                    <option value="">Catégorie</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                        {category}
                        </option>
                    ))}
                    </Select>
                </div>
                <div className='inputOptions'>
                    <label htmlFor="prix">Prix Unitaire:</label>
                    <Input
                    type="text"
                    id="prix_unitaire"
                    value={prix}
                    onChange={handlePrixUnitaire}
                    />
                </div>
                <div className='inputOptions'>
                    <label htmlFor="prix">Prix Collaborateur:</label>
                    <Input
                    type="text"
                    id="prix_unitaire"
                    value={prixCollab}
                    onChange={handlePrixCollaborateur}

                    />
                </div>
           {/* <div className='inputOptions'>
                  <label htmlFor="image">Image:</label>
                  <input
                      type="file"
                      id="image"
                    onChange={handleImageChange} />
                    
              </div>  */}
          </Modal> 
  );
};

export default UpdateProductModal;
