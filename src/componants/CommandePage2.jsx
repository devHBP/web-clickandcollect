import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tasks from './Tasks2';
import { Table, Tag } from "antd";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AiOutlineEye} from "react-icons/ai";
import "../styles/styles.css";

function CommandePageSimple() {
  const [commandes, setCommandes] = useState([]);
  const [tableData, setTableData] = useState([]); 
  const [socket, setSocket] = useState(null);
  const [hasOrders, setHasOrders] = useState(true);

   // const baseUrl = 'http://127.0.0.1:8080';
   const baseUrl = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    allOrders()
  }, []);

  const updateOrderStatus = (orderId, status) => {
    // Update commandes
    setCommandes(prevCommandes => {
      const updatedCommandes = { ...prevCommandes };
      //const orderToUpdate = updatedCommandes.tasks[orderId];
      const orderToUpdate = Object.values(updatedCommandes.tasks).find(order => order.key === orderId);
      if (orderToUpdate) {
        if (status === 'livree' || status === 'annulee') {
          //supprime des tasks une fois livree ou annulee
          delete updatedCommandes.tasks[orderToUpdate.numero_commande];
          //delete updatedCommandes.tasks[orderId];
        } else {
          orderToUpdate.status = status;
        }
      }
      return updatedCommandes;
    });
  
    // Update tableData
    setTableData(prevTableData => {
      const updatedTableData = [...prevTableData];
      const orderToUpdate = updatedTableData.find(order => order.key === orderId);
        if (orderToUpdate) {
          orderToUpdate.status = status;
        }   
      return updatedTableData;
    });
  };

  const allOrders = async () => {
    try {
     
      const response = await axios.get(`${baseUrl}/allOrders`);

      if (response.data.orders && response.data.orders.length === 0) {
        setHasOrders(false);
    } else {
        setHasOrders(true);
    }
    
      const orders = response.data.orders;
        // Fetch product details for each order
      const ordersWithDetails = await Promise.all(orders.map(async order => {
      const productResponse = await axios.get(`${baseUrl}/getOrderProducts/${order.orderId}`);
      const storeResponse = await axios.get(`${baseUrl}/getOneStore/${order.storeId}`);
      const storeName= storeResponse.data.nom_magasin

      const emailUserId = await axios.get(`${baseUrl}/getEmailByUserId/${order.userId}/email`)
      const emailUser = emailUserId.data.email
 
        return {
          ...order,
          productDetails: productResponse.data, // Add product details to order
          storeName: storeName,
          email: emailUser
        };
      }));
      
      const orderData = transformOrderData(ordersWithDetails);
      setCommandes(orderData);
      // Update status in commandes and tableData
      Object.values(orderData.tasks).forEach(order => {
        updateOrderStatus(order.key, order.status);
      });
      setTableData(Object.values(orderData.tasks))

      
    // Itérer sur les commandes
    for (const order of orders) {
      const orderId = order.orderId;
      // Appel à l'API pour récupérer les détails de la commande
      const orderResponse = await axios.get(`${baseUrl}/getOrderProducts/${orderId}`);
      const orderData = orderResponse.data;
     
      for (const product of orderData) {
        // Accéder à la propriété 'libelle'
        const libelle = product.libelle;
        // Utilisez les données de la commande comme souhaité
        //console.log('Commande', orderId, ':', product);
        //console.log('Libelle:', libelle);
      }      
    }

   } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("No orders found.");
        setHasOrders(false);

        // Ici, vous pouvez mettre à jour un état pour afficher un message à l'utilisateur, si nécessaire.
      } else {
        console.error(error);
      }
    }
  }

  //mise en forme data
  const transformOrderData = (orders) => {
    const orderArray = Object.values(orders);
   
    return {
        tasks: orderArray.reduce((acc, order) => {
            const productIdsArray = order.productIds.split(","); // Convertir la chaîne de caractères en tableau

            const date = new Date(order.date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
            const year = date.getFullYear();
            const formattedDate = `${day}-${month}-${year}`; 

          acc[order.numero_commande] = {
            key: order.orderId,
            numero_commande: order.numero_commande,
            client: order.firstname_client + ' ' + order.lastname_client,
            prix_total: order.prix_total,
            nombre_produits: productIdsArray.length,
            status:order.status,
            productDetails: order.productDetails, 
            date:formattedDate,
            heure: order.heure,
            magasin:order.storeName,
            email: order.email, 
            firstname: order.firstname_client
          };
          return acc;
        }, {}),

        columns: {
          "column-1": {
            id: "column-1",
            title: "Commandes en attente",
            taskIds: orderArray.filter(order => order.status === 'en attente').map(order => order.numero_commande),
          },
          "column-3": {
            id: "column-3",
            title: "Commandes prêtes à récupérer",
            taskIds: orderArray.filter(order => order.status === 'prete').map(order => order.numero_commande),
          }
        },
        columnOrder: ["column-1", "column-3"]
      };
    
  };
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = commandes.columns[source.droppableId];
    const finish = commandes.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...commandes,
        columns: {
          ...commandes.columns,
          [newColumn.id]: newColumn,
        },
      };

      setCommandes(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
        ...commandes,
        columns: {
          ...commandes.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
  
      setCommandes(newState);

      // Log the status of the order
    let status;
    switch (newFinish.id) {
      case 'column-1':
        status = 'en attente';
        break;
      // case 'column-2':
      //   status = 'preparation';
      //   break;
      case 'column-3':
        status = 'prete';
        break;
      default:
        status = 'unknown';
    }

    // Update the status of the order in the database
    try {
        const orderId = commandes.tasks[draggableId].key;
        const response = await axios.put(`${baseUrl}/updateStatusOrder/${orderId}`, { status });
        updateOrderStatus(orderId, status);

        if (status === 'prete'){
          const order = commandes.tasks[draggableId];
          const sendEmail = async () => {
            try {
              const res = await axios.post(`${baseUrl}/orderStatusReady`, {
                  email: order.email, 
                  numero_commande: order.numero_commande,
                  date: order.date,
                  point_de_vente: order.magasin,
                  firstname: order.firstname
              });
            } catch (error) {
              console.error("An error occurred while sending the email:", error);
            }
          };
          sendEmail();
        }
      } catch (error) {
        console.error('An error occurred while updating the order status:', error);
      }
}
  


  return (
    (
      hasOrders 
      ?

     ( <div className="commande-page">
      <Tasks commandes={commandes} 
          onDragEnd={onDragEnd} 
          updateOrderStatus={updateOrderStatus} 
          socket={socket} />

  </div>)
:

(
  <p>Pas de commandes</p>
)
    )
    
  );
}

export default CommandePageSimple;
