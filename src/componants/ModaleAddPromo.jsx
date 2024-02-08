import React, { useState} from 'react'
import { AiFillCloseCircle} from "react-icons/ai";


const ModaleAddPromo = ({ setOpenModaleAddPromo, handleAddPromo }) => {

    
    const [code, setCode] = useState('')
    const [percentage, setPercentage] = useState('')
    const [fixedAmount, setFixedAmount] = useState('')
    const [durationInDays, setDurationInDays] = useState('')

    const handleFixedAmountChange = (e) => {
        const value = e.target.value.replace(",", ".");
        setFixedAmount(value);
    };    

    const handlePercentageChange = (e) => {
        const value = e.target.value.replace(",", ".");
        setPercentage(value);
    }; 
    
    const handleAdd = async (e) => {
        e.preventDefault();
        const newCode = {
            code, 
            percentage: percentage !== '' ? parseFloat(percentage) : null,
            fixedAmount: fixedAmount !== '' ? parseFloat(fixedAmount) : null,
            durationInDays,
        }
        // console.log(newCode)
        handleAddPromo(newCode)
    }
    

  return (
    <div className='modale_container'>
         <div className='modale'>
            <div className='title_modale'>
                <p>Ajouter un code promotionnel</p>
                < AiFillCloseCircle className='button_close' onClick={() => setOpenModaleAddPromo(false)}/>
                </div>
            <div className='modale_content'>
          
           
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
                    onChange={handlePercentageChange}
                    />
                </div>

                <div className='inputOptions'>
                    <label htmlFor="percentage">Montant Fixe:</label>
                    <input
                    type="text"
                    id="fixedAmount"
                    name="fixedAmount"
                    value={fixedAmount}
                    onChange={handleFixedAmountChange}
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