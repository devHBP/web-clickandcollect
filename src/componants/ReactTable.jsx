import React, {useState} from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineRest, AiOutlineReload} from "react-icons/ai";
import ModaleDelete from './ModaleDelete';
import ModaleUpdate from './ModaleUpdate';

const ReactTable = ({ elements, handleDelete, handleUpdateProduct }) => {

  const [openModaleDelete, setOpenModaleDelete] = useState(false)
  const [openModaleUpdate, setOpenModaleUpdate] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null);


  const handleUpdate = (id_produit, updatedData) => {
    handleUpdateProduct(updatedData, id_produit ); // Appel de la fonction handleUpdate du composant parent avec les données mises à jour
  };
  const handleConfirmUpdate = (updatedData) => {
    handleUpdate(selectedProductId, updatedData);
    setOpenModaleUpdate(false);
  };
  
  
    const baseUrl = "http://127.0.0.1:8080"
    // const customStyles = {
    //   cells: {
    //     style: {
    //       // backgroundColor: 'blue',
    //     },
    //   }
    // }
  const columns = [
    {
      name: 'Photo',
      selector: 'image',
      cell: row => <img src={`${baseUrl}/${row.image}`} alt="Produit"  width="50"/>,
    },
    {
      name: 'Libellé',
      selector: 'libelle',
      sortable: true,
    },
    {
      name: 'Catégorie',
      selector: 'categorie',
      sortable: true,
    },
    {
      name: 'Prix',
      selector: 'prix',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
            
          <AiOutlineReload  onClick={() => {
                  // setSelectedProductId(row.id_produit);
                  setOpenModaleUpdate(true)
                // console.log(row.id_produit)
            }}/>
            {/* <AiOutlineRest  onClick={() => {
                    // setSelectedProductId(row.id_produit)
                    // setOpenModaleDelete(true)
                    console.log(typeof row.id_produit)
            }}/> */}
            {/* modaleUpdate */}
            { 
              openModaleUpdate && (<ModaleUpdate setOpenModaleUpdate={setOpenModaleUpdate} handleConfirmUpdate={handleConfirmUpdate} id_produit={selectedProductId} />)
              }
            {/* modale delete */}
            {/* {
            openModaleDelete && (<ModaleDelete setOpenModaleDelete={setOpenModaleDelete} handleDelete={handleDelete} id_produit={selectedProductId} />)
            } */}
      </div>
      ),
    },
    
    
  ];
  
  

  const data = elements;

  return <DataTable 
            columns={columns}
            data={data} 
            // customStyles={customStyles}
            pagination
            className='tablereact'
            
          />
          ;
};

export default ReactTable;
