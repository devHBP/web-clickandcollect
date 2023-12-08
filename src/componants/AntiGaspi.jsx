import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { Table, Input } from 'antd'
import { Clickandcollect } from '../../SVG/Clickandcollect';
import { Antigaspi } from '../../SVG/Antigaspi';
import { TextInput } from './TextInput';
const { Search } = Input
import { useSelector } from 'react-redux';


const AntiGaspi = () => {

    const [elements, setElements] = useState([]);
    // const baseUrl = 'http://127.0.0.1:8080';
    const baseUrl = import.meta.env.VITE_REACT_API_URL;    
    const [categories, setCategorie] = useState([])    
    const [searchTerm, setSearchTerm] = useState('');
    const colorClickandCollectOff = "#636C77";
    const colorClickandCollectOn = "#E9520E";
    const [stockValue, setStockValue] = useState({});
    const [role, setRole] = useState(null);

    
    const user = useSelector(state => state.auth.user);
    //console.log("role", user.role)

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllProducts`);
        //console.log(response.data)
        let products = response.data;

        // Si le rôle est "employé", filtrer les produits
        // if (user.role === "employe") {
          products = products.filter(product => product.antigaspi === true);
        // }
        setElements(products);
      } catch (error) {
        console.error('Une erreur s\'est produite, allproducts :', error);
      }
    };

    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllFamillyProducts`);
        //console.log(response.data)
    
        const nomFamilleProduit = response.data.famillesProduit.map(famille => famille.nom_famille_produit);
       // console.log(nomFamilleProduit);
        setCategorie(nomFamilleProduit)
      } catch (error) {
        console.error('Une erreur s\'est produite, allproducts :', error);
      }
    };

    fetchCategories(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

    const handleSearch =  (e) => {
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
    },
    
,    
    {
      title: 'ClickandCollect',
      align: 'center',

      render: (record) => {
        
        const color = record.clickandcollect ? colorClickandCollectOn : colorClickandCollectOff;
    
        return (
            <Clickandcollect 
              color={color} 
            />
        );
      }
    },
    {
      title: 'Antigaspi',
      align: 'center',

      render: (record) => {
    
        const color = record.antigaspi ? colorClickandCollectOn : colorClickandCollectOff;
    
        return (
            <Antigaspi
              color={color} 
            />
        );
      }
    },
    {
        title: 'Stock Anti-Gaspi',
        align: 'center',
      
        render: (record) => {
      
          const handleInputChange = (e, productId) => {
            // Just update the local state
            const updatedValue = e.target.value;
            
            setStockValue(prevStock => ({ ...prevStock, [productId]: updatedValue }));
          };
      
          const handleSave = async (productId) => {
            const updatedValue = stockValue[productId];
            if (updatedValue && updatedValue !== record.stockantigaspi) {
              try {
                const response = await axios.put(`${baseUrl}/updateStatusProduct/${productId}`, { stockantigaspi: updatedValue });
      
                if (response.status !== 200) {
                  throw new Error('Network response was not ok');
                }
      
                setElements(prevElements => {
                  return prevElements.map(p => {
                    if (p.productId === productId) {
                      return { ...p, stockantigaspi: updatedValue };
                    }
                    return p;
                  });
                });
      
              } catch (error) {
                console.error('There has been a problem with your Axios request:', error);
              }
            }
          };
      
          return (
            <div>
              <TextInput 
            value={stockValue[record.productId] !== undefined ? stockValue[record.productId] : (record.stockantigaspi !== null ? record.stockantigaspi : '')}
                onChange={(e) => handleInputChange(e, record.productId)}
                onBlur={() => handleSave(record.productId)}
              />
             
            </div>
          );
        }
      }
    
  ];

  const handleReset = () => {

    // Préparer un nouvel état pour stockValue
    const newStockValue = {};

    // Mettre à jour l'état local pour refléter les stocks à 0
    const updatedElements = elements.map(element => {
        newStockValue[element.productId] = 0; 
        return { ...element, stockantigaspi: 0 };
    });

    // Mettre à jour les états
    setElements(updatedElements);
    setStockValue(newStockValue);

    // Mettre à jour la base de données en arrière-plan
    updatedElements.forEach(element => {
        axios.put(`${baseUrl}/updateStatusProduct/${element.productId}`, { stockantigaspi: '0' })
            .then(response => {
                // console.log(`Stock updated for product ${element.productId}`);
            })
            .catch(error => {
                console.error('Error updating stock:', error);
            });
    });
};




  return (
    <>
    <div className='page_produits_container'>
        
        <div style={{display:'flex', justifyContent:'center', gap: "50px", alignItems:'center'}}>
          <Search 
            placeholder='Rechercher un produit' 
            size="large" 
            style={{width: 250}}
            onChange={handleSearch}/>
             <button onClick={handleReset} className="button_add">
            Reset Stock AntiGaspi
          </button>
        </div>
        
              <div className='Tableau'>
            
                <Table 
                dataSource={elements.filter((product) =>product.libelle.toLowerCase().includes(searchTerm.toLowerCase()))} 
                columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 5 }} rowKey='productId' />
              
              </div>
    </div>
    
    
   
    </>
  )
}

export default AntiGaspi
