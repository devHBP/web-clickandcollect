import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Descriptions } from 'antd';

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
  const [disponibilite, setDisponibilite] = useState(false);
   //specificités produit
   const [specificites, setSpecificites] = useState({
    Vegetarien: '',
    Halal: '',
    Vegan: ''
  });
  const [descriptionProduit, setDescriptionProduit] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [offre, setOffre] = useState('');
  const [referenceFournisseur, setReferenceFournisseur] = useState('');

  useEffect(() => {
    // console.log('Produit à mettre à jour :', product);

    if (product) {
      setLibelle(product.libelle || '');
      setSelectedCategorie(product.categorie || '');
      setPrix(product.prix_unitaire || '');
      setPrixCollab(product.prix_remise_collaborateur || '');
      setDisponibilite(product.disponibilite || false); 
     // Convertir la chaîne de description en objet de spécificités
    const specificitesValues = {
      Vegetarien: false,
      Halal: false,
      Vegan: false
    };
    // Supposons que 'product.description' est une chaîne de caractères comme "Vegetarien, Vegan"
    const specificitesArray = product.description ? product.description.split(', ') : [];
    specificitesArray.forEach(spec => {
      if (spec in specificitesValues) {
        specificitesValues[spec] = true;
      }
    });
    setSpecificites(specificitesValues);
    setDescriptionProduit(product.descriptionProduit || ''); 
    setIngredients(product.ingredients || '')
    setReferenceFournisseur(product.reference_fournisseur || false)
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
const handleSpecificiteChange = (option, value) => {
  setSpecificites((prevSpecificites) => ({
    ...prevSpecificites,
    [option]: value
  }));
};
const handleDescriptionChange = (e) => {
  setDescriptionProduit(e.target.value);
};
const handleIngredientsChange = (e) => {
  setIngredients(e.target.value);
};
const handleOffre31Change = (e) => {
  const cleanedLibelle = libelle.replace(/\s+/g, '');
  setOffre(e.target.checked ? 'offre31_' + cleanedLibelle : '');
};
const handleSolanidChange = (e) => {
  setReferenceFournisseur(e.target.checked ? 'Solanid' : '');
};

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    // console.log('Soumission du produit avec ID :', product?.productId);
    const descriptionArray = Object.entries(specificites)
    .filter(([key, value]) => value)
    .map(([key]) => key);
  const description = descriptionArray.join(', ');

    const updatedData = {
      libelle,
      categorie: selectedCategorie,
      prix_unitaire: prix,
      prix_remise_collaborateur: prixCollab,
      disponibilite: disponibilite,
      description: description,
      descriptionProduit: descriptionProduit,
      ingredients: ingredients,
      referenceFournisseur: referenceFournisseur,
      offre:offre,
    };
    console.log('modale updatedata', updatedData)
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
                  <Select 
                    id="categorie" 
                    value={selectedCategorie} 
                    onChange={(value) => setSelectedCategorie(value)} 
                  >
                    <Select.Option value="">Catégorie</Select.Option>
                    {categories.map((category, index) => (
                      <Select.Option key={index} value={category}>
                        {category}
                      </Select.Option>
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
                <div className='inputDisponible'>
                    <label htmlFor="disponibilite">Disponible:</label>
                    <input
                    type="checkbox"
                    id="disponibilite"
                    name="disponibilite"
                    checked={disponibilite}
                    onChange={(e) => setDisponibilite(e.target.checked)}
                    />
                </div>
               <div className='inputCheckbox'>
                  <p>Spécificités:</p>
                  {/* Ici, remplacez 'specificites' par un objet avec des clés correspondant aux labels exacts que vous souhaitez afficher */}
                  {Object.entries({
                    Vegetarien: specificites.Vegetarien,
                    Halal: specificites.Halal,
                    Vegan: specificites.Vegan
                  }).map(([label, isChecked]) => (
                    <div key={label}>
                      <label htmlFor={label}>{label}:</label>
                      <input
                        type="checkbox"
                        id={label}
                        name={label}
                        checked={isChecked || false} // ici, utilisez la valeur de l'objet 'specificites' pour la spécificité correspondante
                        onChange={(e) => handleSpecificiteChange(label, e.target.checked)}
                        className='check'
                      />
                    </div>
                  ))}
                </div>
                <div className='inputOptions'>
                  <label htmlFor="description">Description du produit:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={descriptionProduit}
                    onChange={handleDescriptionChange}
                    rows={4}
                    cols={50}
                  />
                </div>
                <div className='inputOptions'>
                  <label htmlFor="ingredients">Ingrédients :</label>
                  <textarea
                      id="ingredients"
                      name="ingredients"
                      value={ingredients}
                      onChange={handleIngredientsChange}
                      rows={4}
                      cols={50}
                    />
                </div>
                <div className='inputOptions'>
                  <label htmlFor="offre31">Offre 3+1:</label>
                  <input
                    type="checkbox"
                    id="offre31"
                    name="offre31"
                    checked={offre}
                    onChange={handleOffre31Change}
                  />
                </div>
                <div className='inputOptions'>
                <label htmlFor="solanid">Solanid:</label>
                <input
                  type="checkbox"
                  id="solanid"
                  name="solanid"
                  checked={referenceFournisseur === 'Solanid'}
                  onChange={handleSolanidChange}
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
