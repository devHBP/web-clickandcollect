import React, { useState} from 'react'
import { AiFillCloseCircle} from "react-icons/ai";
import axios from 'axios';

const ModaleAdd = ({ setOpenModaleAdd, handleAddProduct, }) => {

    const [image, setImage] = useState(null);
    const [libelle, setLibelle] = useState('')
    const [categorie, setCategorie] = useState('')
    const [prix, setPrix] = useState('')

    const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Boissons', 'Desserts'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setImage(file);
      };

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
        formData.append('categorie', categorie);
        formData.append('prix', prix);
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
                    <select id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} name="categorie">
                    <option value="">Catégorie</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                        {category}
                        </option>
                    ))}
                    </select>
                </div>

                <div className='inputOptions'>
                    <label htmlFor="prix">Prix:</label>
                    <input
                    type="text"
                    id="prix"
                    name="prix"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
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