import React from 'react'
import { AiFillCloseCircle} from "react-icons/ai";


const ModaleDelete = ({setOpenModaleDelete, handleDelete, id_produit}) => {

    const handleConfirmDelete = () => {
        handleDelete(id_produit);
        setOpenModaleDelete(false);
      };
  return (
    <div className='modale_container'>
        
        <div className='modale'>
            < AiFillCloseCircle className='button_close' onClick={() => setOpenModaleDelete(false)}/>
            <div className='modale_content'>
                <p>Voulez vous supprimer ce produit ?</p>
                <button onClick={handleConfirmDelete}>Valider</button>
            </div>
            </div>
    </div>
    
  )
}

export default ModaleDelete