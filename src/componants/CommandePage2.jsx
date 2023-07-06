import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tasks from './Tasks2';
import { Table, Tag } from "antd";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AiOutlineEye} from "react-icons/ai";


function CommandePageSimple() {
  const [commandes, setCommandes] = useState([]);
  const [tableData, setTableData] = useState([]); 

  useEffect(() => {
    allOrders()
  }, []);


  const updateOrderStatus = (orderId, status) => {
    // Update commandes
    setCommandes(prevCommandes => {
      const updatedCommandes = { ...prevCommandes };
      const orderToUpdate = updatedCommandes.tasks[orderId];
      if (orderToUpdate) {
        if (status === 'livree' || status === 'annulee') {
          //supprime des tasks une fois livree ou annulee
          delete updatedCommandes.tasks[orderId];
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
     
      const response = await axios.get('http://127.0.0.1:8080/allOrders');
      const orders = response.data.orders;
        // Fetch product details for each order
      const ordersWithDetails = await Promise.all(orders.map(async order => {
      const productResponse = await axios.get(`http://127.0.0.1:8080/getOrderProducts/${order.orderId}`);
      const storeResponse = await axios.get(`http://127.0.0.1:8080/getOneStore/${order.storeId}`);
      const storeName= storeResponse.data.nom_magasin
 
        return {
          ...order,
          productDetails: productResponse.data, // Add product details to order
          storeName: storeName
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
      const orderResponse = await axios.get(`http://127.0.0.1:8080/getOrderProducts/${orderId}`);
      const orderData = orderResponse.data;
     
      for (const product of orderData) {
        // Accéder à la propriété 'libelle'
        const libelle = product.libelle;
        // Utilisez les données de la commande comme souhaité
        console.log('Commande', orderId, ':', product);
        console.log('Libelle:', libelle);
      }      
    }
    } catch (error) {
      console.error(error);
    }
  };


  //mise en forme data
  const transformOrderData = (orders) => {
    const orderArray = Object.values(orders);
    console.log(orderArray)
   
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
            magasin:order.storeName
          };
          return acc;
        }, {}),
        columns: {
          "column-1": {
            id: "column-1",
            title: "Commandes en attente",
            taskIds: orderArray.filter(order => order.status === 'en attente').map(order => order.numero_commande),
          },
          "column-2": {
            id: "column-2",
            title: "Commandes en préparation",
            taskIds: orderArray.filter(order => order.status === 'preparation').map(order => order.numero_commande),
          },
          "column-3": {
            id: "column-3",
            title: "Commandes prêtes à récupérer",
            taskIds: orderArray.filter(order => order.status === 'prete').map(order => order.numero_commande),
          }
        },
        columnOrder: ["column-1", "column-2", "column-3"]
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
      case 'column-2':
        status = 'preparation';
        break;
      case 'column-3':
        status = 'prete';
        break;
      default:
        status = 'unknown';
    }
    console.log(`Order ${draggableId} is now  : ${status}`);

    // Update the status of the order in the database
    try {
        const orderId = commandes.tasks[draggableId].key;
        const response = await axios.put(`http://127.0.0.1:8080/updateStatusOrder/${orderId}`, { status });
        updateOrderStatus(orderId, status);
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
    <div className="commande-page">
      <Tasks commandes={commandes} onDragEnd={onDragEnd} updateOrderStatus={updateOrderStatus} />

      <Tabs className="tableau_commandes">

          <TabList>
             <Tab>Toutes les commandes</Tab>
             <Tab>Livrées</Tab>
             <Tab>Annulées</Tab>
           </TabList>

          <TabPanel>
             <Table dataSource={tableData} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
          <TabPanel>
             <Table dataSource={tableData.filter(commande => commande.status === 'livree')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
          <TabPanel>
              <Table dataSource={tableData.filter(commande => commande.status === 'annulee')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>    

      </Tabs>
    </div>
  );
}

export default CommandePageSimple;
