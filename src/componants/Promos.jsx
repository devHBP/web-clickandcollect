import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { Table, Modal, Input } from 'antd'
import { AiOutlineRest, AiOutlineReload} from "react-icons/ai";
import ModaleAddPromo from './ModaleAddPromo';

export default function Promos() {

    const [elements, setElements] = useState([]);
    const [openModaleAddPromo, setOpenModaleAddPromo] = useState(false)

    useEffect(() => {
        // Fonction pour récupérer les données de la base de données
        const fetchData = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8080/promocodes');
            console.log(response.data);
            setElements(response.data)
          } catch (error) {
            console.error('Une erreur s\'est produite, promocodes :', error);
          }
        };
    
        fetchData(); // Appel de la fonction fetchData lors du montage du composant
      }, []);

      const updatePromo = (newCodes) => {
        setElements(newCodes);
      };
    
      //ajout handleAddProduct
      const handleAddPromo = async (newCode) => {
        try {
          const baseUrl = 'http://127.0.0.1:8080';
          await axios.post(`${baseUrl}/promocodes`, newCode);
    
          const response = await axios.get(`${baseUrl}/promocodes`);
          const allPromosUpdates = response.data;
          console.log('allPromosUpdates', allPromosUpdates)
          updatePromo(allPromosUpdates);
          setOpenModaleAddPromo(false);
          console.log('promo ajouté')
        } catch (error) {
          console.error('There has been a problem with your Axios request:', error);
        }
      };
      const handleDeletePromo = async (id) => {
        try {
           //serveur nodeJS
          const baseUrl = "http://127.0.0.1:8080"
          const response = await axios.delete(`${baseUrl}/deletepromocodes/${id}`);
  
          // Vérifiez le statut de la réponse
          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          // Actualisez votre état ici pour refléter la suppression du produit
          const updatedPromos = elements.filter((promo) => promo.id !== id)
          setElements(updatedPromos)
          console.log('promo supprimé')
  
        } catch (error) {
          console.error('There has been a problem with your Axios request:', error);
        }
    }

      const Delete = (record) => { 
        console.log(record.code)
        Modal.confirm({
          title: `Etes vous sur de supprimer cette promotion : ${record.code} ?`,
          onOk:  () => {
            handleDeletePromo(record.id)
          }
        })
        }; 
        // const Update = (record) => { 
        //     console.log(record.id)
        //     Modal.confirm({
        //       title: `Etes vous sur de moddifier ce produit : ${record.id} ?`,
        //       onOk:  () => {
        //         handleUpdate(record.id)
        //       }
        //     })
        //     }; 


      const columns = [
        
        {
          title: 'Code',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: 'Pourcentage',
          dataIndex: 'percentage',
          key: 'percentage',
        },
        {
          title: 'Durée',
          dataIndex: 'durationInDays',
          key: 'durationInDays',
        },
        { 
          key: "action", 
          title: "Actions", 
          render: (record) => { 
          return ( 
          <> 
          {/* <AiOutlineReload 
          onClick={() => Update(record)} 
          />  */}
          <AiOutlineRest 
          onClick={() => Delete(record)} 
          />
       
          </> 
          ); 
          }, 
          },
      ];

    
  return (
    <>
    <div>
        <h3>Codes - Promotions</h3>

        <div style={{display:'flex', justifyContent:'center', margin: 30}}>
        <button onClick={() => setOpenModaleAddPromo(true)} >Ajouter un code promo</button>
        </div>
        <Table 
                dataSource={elements} 
                columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} rowKey='promotionId' />
              
    </div>
    {
    openModaleAddPromo && 
    (<ModaleAddPromo setOpenModaleAddPromo={setOpenModaleAddPromo} handleAddPromo={handleAddPromo}/>)
  }
    </>
  )
  
  
}
