import React, { useState, useEffect} from 'react'
import axios from 'axios'
import '../styles/dashboard.css'


const DashboardPage = () => {

  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [ordersData, setOrdersData] = useState({ orders: [], average: 0, totalVentes: 0 });
  const [ clientData, setClientData] = useState({ clients : []})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        //toutes les commandes
        const response = await axios.get(`${baseUrl}/allOrders`); 
        const allOrders = response.data.orders

        //total des ventes - chiffres d'affaires
        const totalVentes = allOrders.reduce((acc, order) => {
        const prixTotalAsNumber = parseFloat(order.prix_total);
          if (isNaN(prixTotalAsNumber)) {
            console.warn(`La commande avec l'ID ${order.id} a un 'prix_total' non valide : ${order.prix_total}`);
            return acc; 
          }
          return acc + prixTotalAsNumber;
        }, 0);        
        //calcul panier moyen
        const average = (allOrders.length > 0 ) ? (totalVentes / allOrders.length) : 0

        setOrdersData({
          orders: response.data.orders,
          average,
          totalVentes
        });

        //clients
        const resp = await axios.get(`${baseUrl}/getAll`); 
        setClientData({
          clients : resp.data
        })
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };


    fetchOrders();
  }, []);

  return (
    <div className='content_dashboard'>
       <div className='content_analytics'>

        <h2>Analyses Le Pain du Jour - Mas Guérido</h2>

        {/* 1ere partie */}
          <div className='first_part'> 
            <div className='highlight-box'>
              <p>Commandes "En attente": </p>
              <p>{ordersData.orders.filter(order => order.status === 'en attente').length}</p>
            </div>
            <div className='highlight-box'>
              <p>Commandes "Prêtes": </p>
              <p>{ordersData.orders.filter(order => order.status === 'prete').length}</p>
            </div>
            <div className='highlight-box'>
              <p>Nombre de commandes:  </p>
              <p>{ordersData.orders.length}</p>
            </div>
          </div>

          {/* 2e partie  */}
          <div className='second_part'>
            <div className='highlight-box'>
              <p>Nb clients:  </p>
              <p> {clientData.clients.filter(client => client.role === 'client' || client.role === 'SUNcollaborateur').length}</p>
            </div>
            <div className='highlight-box'>
              <p>Horaires d'affluence</p>
            </div>
           
          </div>
          {/* 3e partie  */}
          <div className='third_part'>
            <div className='highlight-box'>
              <p>Panier moyen: </p>
              <p>{(ordersData.average).toFixed(2)}€</p>
            </div>
            <div className='highlight-box'>
              <p>Chiffre d'affaires: </p>
              <p> {(ordersData.totalVentes).toFixed(2)}€</p>
            </div>
          </div>
          {/* 4e partie */}
          <div className='fourth'>
            <div className='highlight-box'>
              <p>Top 5 ventes </p>
            </div>
          </div>
       </div>
              
    </div>
    
  )
}

export default DashboardPage