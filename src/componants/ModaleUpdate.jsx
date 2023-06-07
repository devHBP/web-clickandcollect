import React, { useState } from 'react'
import { AiFillCloseCircle} from "react-icons/ai";


const ModaleUpdate = ({setOpenModaleUpdate, handleConfirmUpdate, id_produit  }) => {

    
    const [libelle, setLibelle] = useState('')
    const [categorie, setCategorie] = useState('')
    const [prix, setPrix] = useState('')

    const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs'];

    const handleUpdate = () => {
        const updatedData = {
          libelle: libelle,
          categorie: categorie,
          prix: prix
        };
        // console.log('updateddata', updatedData)
        handleConfirmUpdate(updatedData);
      };

    
  return (
    
        //modale_container
        <div className='modale_container'>
        {/* <div className='modale'>
            < AiFillCloseCircle className='button_close' onClick={() => setOpenModaleUpdate(false)}/>
            <div className='modale_content'>
                <p>Quels champs souhaitez vous modifier</p>
               
                <div className='inputOptions'>
                    <label htmlFor="libelle">Libellé:</label>
                    <input
                    type="text"
                    id="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    />
                </div>
                <div className="inputOptions">
                    <label htmlFor="categorie">Sélectionner une catégorie:</label>
                    <select id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
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
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    />
                </div>

                <button onClick={handleUpdate}>Valider</button>
                
            </div> 
            </div>*/}
            </div>
            

    
    
  )
}

export default ModaleUpdate