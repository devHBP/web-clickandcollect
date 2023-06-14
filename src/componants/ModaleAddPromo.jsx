import React, { useState} from 'react'
import { AiFillCloseCircle} from "react-icons/ai";


const ModaleAddPromo = ({ setOpenModaleAddPromo, handleAddPromo }) => {

    
    const [code, setCode] = useState('')
    const [percentage, setPercentage] = useState('')
    const [durationInDays, setDurationInDays] = useState('')

    
    const handleAdd = async (e) => {
        e.preventDefault();
        const newCode = {
            code, 
            percentage,
            durationInDays,
        }
        console.log(newCode)
        handleAddPromo(newCode)
    }
    

  return (
    <div className='modale_container'>
         <div className='modale'>
            < AiFillCloseCircle className='button_close' onClick={() => setOpenModaleAddPromo(false)}/>
            <div className='modale_content'>
            <p>Ajouter un produit</p>
            <form onSubmit={handleAdd}>
                
                

                <div className='inputOptions'>
                    <label htmlFor="code">Code:</label>
                    <input
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="percentage">Pourcentage:</label>
                    <input
                    type="text"
                    id="percentage"
                    name="percentage"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="durée">Durée du code (jours) :</label>
                    <input
                    type="text"
                    id="durationInDays"
                    name="durationInDays"
                    value={durationInDays}
                    onChange={(e) => setDurationInDays(e.target.value)}
                    />
                </div>

                <button type='submit'>Valider</button>
            </form>
            </div>
            </div>
    </div>
  )
}

export default ModaleAddPromo