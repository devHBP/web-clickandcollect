import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ModaleAdd from './ModaleAdd'
import { Table, Modal, Input } from 'antd'
import { AiOutlineRest, AiOutlineReload, AiOutlineStock} from "react-icons/ai";
const { Search } = Input


const ProduitsPage = () => {

    const [elements, setElements] = useState([]);
    const [openModaleAdd, setOpenModaleAdd] = useState(false)
    const baseUrl = "http://127.0.0.1:8080"
    const [libelle, setLibelle] = useState('')
    const [categorie, setCategorie] = useState('')
    const [prix, setPrix] = useState('')
    const [visible, setVisible] = useState(false); 
    const [visibleStock, setVisibleStock] = useState(false); 
    const [stock, setStock] = useState('')
    const [ increaseAmount, setIncreaseAmount] = useState('')
    const [decreaseAmount, setDecreaseAmount] = useState('')
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Salades et Bowls', 'Boissons'];
   


  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
        console.log(response.data)
        setElements(response.data);
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    };

    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

  const handleDelete = async (productId) => {
      try {
         //serveur nodeJS
        const baseUrl = "http://127.0.0.1:8080"
        const response = await axios.delete(`${baseUrl}/deleteProduct/${productId}`);

        // Vérifiez le statut de la réponse
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        // Actualisez votre état ici pour refléter la suppression du produit
        const updatedProduits = elements.filter((produit) => produit.productId !== productId)
        setElements(updatedProduits)
        console.log('produit supprimé')

      } catch (error) {
        console.error('There has been a problem with your Axios request:', error);
      }
  }
  
  const handleUpdateProduct = async (productId, updatedData) => {
    console.log(updatedData)
    try {
      const baseUrl = 'http://127.0.0.1:8080';
      const response = await axios.put(`${baseUrl}/updateProduct/${productId}`, updatedData);
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
  
      const updatedElements = elements.map((element) => {
        if (element.productId === productId) {
          return { ...element, ...updatedData };
        }
        return element;
      });
  
      setElements(updatedElements);
    } catch (error) {
      console.error('There has been a problem with your Axios request:', error);
    }
  };
  const updateProduits = (newProduits) => {
    setElements(newProduits);
  };

  //ajout handleAddProduct
  const handleAddProduct = async (formData) => {
    try {
      const baseUrl = 'http://127.0.0.1:8080';
      await axios.post(`${baseUrl}/addProduct`, formData);
      const response = await axios.get(`${baseUrl}/getAllProducts`);
      const allProductsUpdated = response.data;
      console.log('allProductsUpdated', allProductsUpdated)
      updateProduits(allProductsUpdated);
      setOpenModaleAdd(false);
    } catch (error) {
      console.error('There has been a problem with your Axios request:', error);
    }
  };
  const Delete = (record) => { 
    // console.log(record.id_produit)
    Modal.confirm({
      title: `Etes vous sur de supprimer ce produit : ${record.libelle} ?`,
      onOk:  () => {
        handleDelete(record.productId)
      }
    })
    }; 
    const Update = (record) => { 
      //  console.log(record.productId)
       setVisible(true)
       setLibelle(record.libelle);
       setCategorie(record.categorie);
       setPrix(record.prix_unitaire)
       setSelectedProductId(record.productId)
      
    }
    const ModifyStock = (record) => {
      // console.log(record.stock)
      setVisibleStock(true)
    }

    const handleSearch =  (e) => {
      // console.log('value:', e.target.value)
      setSearchTerm(e.target.value);
    };
      

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={`${baseUrl}/${image}`} alt="Produit" width="50" />,
    },
    {
      title: 'Libellé',
      dataIndex: 'libelle',
      key: 'libelle',
      sorter: (a, b) => a.libelle.localeCompare(b.libelle),
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie',
      key: 'categorie',
      sorter: (a, b) => a.categorie.localeCompare(b.categorie),
    },
    {
      title: 'Prix',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      sorter: (a, b) => a.prix_unitaire - b.prix_unitaire,
    },
    {
      title: 'Prix Collab',
      dataIndex: 'prix_remise_collaborateur',
      key: 'prix_remise_collaborateur',
      // sorter: (a, b) => a.prix_remise_collaborateur- b.prix_remise_collaborateur,
    },
    // {
    //   title: 'Prix Client',
    //   dataIndex: 'prix_remise_client',
    //   key: 'prix_remise_client',
    //   sorter: (a, b) => a.prix_remise_client- b.prix_remise_client,
    // },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      //sorter: (a, b) => a.stock- b.stock,
    },
    { 
      key: "action", 
      title: "Actions", 
      render: (record) => { 
      return ( 
      <> 
      <AiOutlineReload 
      onClick={() => Update(record)} 
      /> 
      <AiOutlineRest 
      onClick={() => Delete(record)} 
      />
      <AiOutlineStock 
      onClick={() => ModifyStock(record)}/>
      <Modal 
          title="Modification du produit"
          open={visible}
          onCancel={() => setVisible(false)} 
          onOk={() => {
            const updatedData = {
              libelle: libelle,
              categorie: categorie,
              prix_unitaire: prix
            };
            // console.log(updatedData)
            // console.log('select id', selectedProductId)
            handleUpdateProduct(selectedProductId, updatedData)
            setVisible(false);
            
          }}
          okText="Save" 
          maskStyle={{ backgroundColor: 'lightgray' }}
          >
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
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                        {category}
                        </option>
                    ))}
                    </select>
                </div>
                <div className='inputOptions'>
                    <label htmlFor="prix">Prix:</label>
                    <input
                    type="text"
                    id="prix_unitaire"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    />
                </div>
          </Modal>

          <Modal 
          title='Modification du stock'
          open={visibleStock}
          onCancel={() => setVisibleStock(false)} 
          onOk={() => {
            console.log('ajout stock', increaseAmount)
            console.log('baisse stock', decreaseAmount)
            console.log('product Id', record.productId)
            
          }}
          okText="Save" 
          maskStyle={{ backgroundColor: 'lightgray' }}
          >
            <p>Produit: {record.libelle}</p>
            <div style={{display:'flex', gap: '20px'}}>
            <div className='inputOptions'>
                    <label htmlFor="stock">Ajouter Stock:</label>
                    <input
                    type="text"
                    id="stock"
                    value={ increaseAmount}
                    onChange={(e) => setIncreaseAmount(e.target.value)}
                    style={{ width: '30px' }}
                    />
                </div>
                <div className='inputOptions'>
                    <label htmlFor="stock">Diminuer Stock:</label>
                    <input
                    type="text"
                    id="stock"
                    value={decreaseAmount}
                    onChange={(e) => setDecreaseAmount(e.target.value)}
                    style={{ width: '30px' }}
                    />
                </div>
            </div>
            
                
          </Modal>
   
      </> 
      ); 
      }, 
      },
  ];

  return (
    <>
    <div className='page_produits_container'>
        <h3>Les produits</h3>
        
        <div style={{display:'flex', justifyContent:'space-around'}}>
          <button onClick={() => setOpenModaleAdd(true)}>Ajouter un produit</button>
          <Search 
            placeholder='Rechercher un produit' 
            size="medium" 
            style={{width: 200}}
            onChange={handleSearch}/>
        </div>
        
              <div className='Tableau'>
            
                <Table 
                dataSource={elements.filter((product) =>product.libelle.toLowerCase().includes(searchTerm.toLowerCase()))} 
                columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} rowKey='productId' />
              
              </div>
    </div>
    
    {
      openModaleAdd && 
      (<ModaleAdd setOpenModaleAdd={setOpenModaleAdd} handleAddProduct={handleAddProduct}/>)
    }
   
    </>
  )
}

export default ProduitsPage