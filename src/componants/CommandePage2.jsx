import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tasks from './Tasks2';
import { Table, Tag } from "antd";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AiOutlineEye} from "react-icons/ai";


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
            email: order.email
          };
          return acc;
        }, {}),

        columns: {
          "column-1": {
            id: "column-1",
            title: "Commandes en attente",
            taskIds: orderArray.filter(order => order.status === 'en attente').map(order => order.numero_commande),
          },
          // "column-2": {
          //   id: "column-2",
          //   title: "Commandes en préparation",
          //   taskIds: orderArray.filter(order => order.status === 'preparation').map(order => order.numero_commande),
          // },
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
          // console.log('Commande:', order);
          const sendEmail = async () => {
            try {
              // Assurez-vous que user.email et user.firstname sont accessibles à partir de cet endroit du code.
              const res = await axios.post(`${baseUrl}/orderStatusReady`, {
                  email: order.email, 
                  firstname: order.client
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
  
//tableau
const columns = [
    {
      title: "Numéro de commande",
      dataIndex: "numero_commande",
      key: "numero_commande"
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client"
    },
    ,
    {
      title: "Prix total",
      dataIndex: "prix_total",
      key: "prix_total"
    },
    ,
    {
      title:'Pain du Jour',
      dataIndex:'magasin', 
      key:'magasin'
    },
    ,
    {
      title: "Passée le ",
      dataIndex: "date",
      key: "date"
    },
    {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a.status.localeCompare(b.status), 
    sortDirections: ['descend', 'ascend'],
    render: (status) => {
      let color;
      switch (status) {
        case 'en attente':
          color = 'orange';
          break;
        case 'preparation':
          color = 'blue';
          break;
        case 'prete':
          color = 'green';
          break;
        case 'livree':
          color = 'yellow';
          break;
        case 'annulee':
          color = 'red';
          break;
        default:
          color = 'default';
      }
      return <Tag color={color}>{status}</Tag>;
    }
      },
      { 
        key: "action", 
        title: "Actions", 
        render: (record) => { 
        return ( 
        <> 
        <AiOutlineEye 
        onClick={() => Open(record)} 
        /> 
        </>
        )
      }}
  ];
  const Open = (record) => { 
    console.log(record)
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

    <Tabs className="tableau_commandes">

        <TabList>
           <Tab>Toutes les commandes</Tab>
           <Tab>Livrées</Tab>
           <Tab>Annulées</Tab>
         </TabList>

        <TabPanel>
           <Table dataSource={tableData} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 10 }} />
        </TabPanel>
        <TabPanel>
           <Table dataSource={tableData.filter(commande => commande.status === 'livree')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
        </TabPanel>
        <TabPanel>
            <Table dataSource={tableData.filter(commande => commande.status === 'annulee')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
        </TabPanel>    

    </Tabs>
  </div>)
:

(
  <p>Pas de commandes</p>
)
    )
    
  );
}

export default CommandePageSimple;
