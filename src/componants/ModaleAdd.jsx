import React, { useState, useEffect} from 'react'
import { AiFillCloseCircle} from "react-icons/ai";
import axios from 'axios'

const ModaleAdd = ({ setOpenModaleAdd, handleAddProduct, }) => {

    const [image, setImage] = useState(null);
    const [libelle, setLibelle] = useState('')
    const [categories, setCategorie] = useState([])
    const [selectedCategorie, setSelectedCategorie] = useState('')
    const [prix, setPrix] = useState('')
    const [prixRemiseCollaborateur, setPrixRemiseCollaborateur] = useState('');
    const [disponibilite, setDisponibilite] = useState(false);
    const [stock, setStock] = useState('');

    // const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Boissons',
    // 'Desserts', 'Salades et Bowls', 'Boules et Pains spéciaux', 'Baguettes'];
    
    useEffect(() => {
        // Fonction pour récupérer les données de la base de données
        const fetchCategories = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8080/getAllFamillyProducts');
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

    const handleAdd = async (e) => {
        e.preventDefault();
        // const newProduct = {
        //     image, 
        //     libelle,
        //     categorie,
        //     prix
        // }
        // console.log(newProduct)
        const formData = new FormData();
        formData.append('image', image);
        formData.append('libelle', libelle);
        formData.append('categorie', selectedCategorie);
        formData.append('prix_unitaire', prix);
        formData.append('prix_remise_collaborateur', prixRemiseCollaborateur);
        formData.append('disponibilite', disponibilite);
        formData.append('stock', stock);
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

                <button type='submit'>Valider</button>
            </form>
            </div>
            </div>
    </div>
  )
}

export default ModaleAdd