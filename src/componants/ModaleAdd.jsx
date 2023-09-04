import React, { useState, useEffect} from 'react'
import { AiFillCloseCircle} from "react-icons/ai";
import axios from 'axios'

const ModaleAdd = ({ setOpenModaleAdd, handleAddProduct, }) => {

   // const baseUrl = 'http://127.0.0.1:8080';
   const baseUrl = import.meta.env.VITE_REACT_API_URL;
  
    const [image, setImage] = useState(null);
    const [libelle, setLibelle] = useState('')
    const [categories, setCategorie] = useState([])
    const [selectedCategorie, setSelectedCategorie] = useState('')
    const [prix, setPrix] = useState('')
    const [prixRemiseCollaborateur, setPrixRemiseCollaborateur] = useState('');
    const [disponibilite, setDisponibilite] = useState(false);
    const [stock, setStock] = useState('');
    const [offre, setOffre] = useState('');
    const [referenceFournisseur, setReferenceFournisseur] = useState('');

    //specificités produit
    const [specificites, setSpecificites] = useState({
      Vegetarien: '',
      Halal: '',
      Vegan: ''
    });
    const [descriptionProduit, setDescriptionProduit] = useState('');
    const [ingredients, setIngredients] = useState('');

    // const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Boissons',
    // 'Desserts', 'Salades et Bowls', 'Boules et Pains spéciaux', 'Baguettes'];
    
    useEffect(() => {
        // Fonction pour récupérer les données de la base de données
        const fetchCategories = async () => {
          try {
            const response = await axios.get(`${baseUrl}/getAllFamillyProducts`);
            console.log(response.data)
        
            const nomFamilleProduit = response.data.famillesProduit.map(famille => famille.nom_famille_produit);
            console.log(nomFamilleProduit);
            setCategorie(nomFamilleProduit)
          } catch (error) {
            console.error('Une erreur s\'est produite, allproducts :', error);
          }
        };
    
        fetchCategories(); // Appel de la fonction fetchData lors du montage du composant
      }, []);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setImage(file);
      };

    //transforme virgule en point dans le prix
    const handlePrixUnitaire = (e) => {
        const value = e.target.value;
        setPrix(value.replace(',','.'))
    }
    const handlePrixCollaborateur = (e) => {
        const value = e.target.value;
        setPrixRemiseCollaborateur(value.replace(',','.'))
    }
    //choix des options spécifiques
    const handleSpecificiteChange = (option, value) => {
      setSpecificites((prevSpecificites) => ({
        ...prevSpecificites,
        [option]: value ? option : '',
      }));
    };
    //descriptionProduit
    const handleDescriptionChange = (e) => {
      setDescriptionProduit(e.target.value);
    };
    //ingredients
    const handleIngredientsChange = (e) => {
      setIngredients(e.target.value);
    };

    //enleve les espaces des offres
    const handleOffre31Change = (e) => {
      const cleanedLibelle = libelle.replace(/\s+/g, '');
      setOffre(e.target.checked ? 'offre31_' + cleanedLibelle : '');
    };

    const handleSolanidChange = (e) => {
      setReferenceFournisseur(e.target.checked ? 'Solanid' : '');
    };
    
    
    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('libelle', libelle);
        formData.append('categorie', selectedCategorie);
        formData.append('prix_unitaire', prix);
        formData.append('prix_remise_collaborateur', prixRemiseCollaborateur);
        formData.append('disponibilite', disponibilite);
        formData.append('stock', stock);

        let description = '';
        for (const option in specificites) {
          if (specificites[option]) {
            description += option + ', ';
          }
        }
        // Supprimez la dernière virgule et l'espace
        description = description.slice(0, -2);
        formData.append('description', description);
        formData.append('descriptionProduit', descriptionProduit);
        formData.append('ingredients', ingredients);
        formData.append('offre', offre);
        formData.append('reference_fournisseur', referenceFournisseur);

        //console.log comme ceci pour voir formData
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
          }
          //nouveau produit ajouté
        handleAddProduct(formData);
    }


    

  return (
    <div className='modale_container'>
         <div className='modale'>
            < AiFillCloseCircle className='button_close' onClick={() => setOpenModaleAdd(false)}/>
            <div className='modale_content'>
            <p>Ajouter un produit</p>
            <form onSubmit={handleAdd}>
                
                <div className="inputOptions">
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" onChange={handleImageChange} name="image" />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="libelle">Libellé:</label>
                    <input
                    type="text"
                    id="libelle"
                    name="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    />
                </div>

                <div className="inputOptions">
                    <label htmlFor="categorie">Sélectionner une catégorie:</label>
                    <select id="categorie" value={selectedCategorie} onChange={(e) => setSelectedCategorie(e.target.value)} name="categorie">
                    <option value="">Catégorie</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                        {category}
                        </option>
                    ))}
                    </select>
                </div>

                <div className='inputOptions'>
                    <label htmlFor="prix_unitaire">Prix:</label>
                    <input
                    type="text"
                    id="prix_unitaire"
                    name="prix_unitaire"
                    value={prix}
                    onChange={handlePrixUnitaire}
                    />
                </div>
                
                <div className='inputOptions'>
                    <label htmlFor="prix_remise_collaborateur">Prix remise collaborateur:</label>
                    <input
                    type="text"
                    id="prix_remise_collaborateur"
                    name="prix_remise_collaborateur"
                    value={prixRemiseCollaborateur}
                    onChange={handlePrixCollaborateur}
                    />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="disponibilite">Disponible:</label>
                    <input
                    type="checkbox"
                    id="disponibilite"
                    name="disponibilite"
                    checked={disponibilite}
                    onChange={(e) => setDisponibilite(e.target.checked)}
                    />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="stock">Stock:</label>
                    <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                
                
                <div className='inputCheckbox'>
                <p>Spécificités:</p>
                    {Object.entries(specificites).map(([option, checked]) => (
                  <div  key={option}>
                    <label htmlFor={option}>{option}:</label>
                    <input
                      type="checkbox"
                      id={option}
                      name={option}
                      checked={checked}
                      onChange={(e) => handleSpecificiteChange(option, e.target.checked)}
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



                <button type='submit'>Valider</button>
            </form>
            </div>
            </div>
    </div>
  )
}

export default ModaleAdd