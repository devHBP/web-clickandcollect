import React, { useState, useEffect} from "react";
import Tasks from "./Tasks";
import { Table, Tag } from "antd";
import {AiOutlineEye} from "react-icons/ai";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {initialData} from '../datas/datas'
import axios from 'axios'

function CommandePage() {

  //mise à jour données entre commandepage et tasks
  const [commandeDataSource, setCommandeDataSource] = useState([]);

  useEffect(() => {
    setCommandeDataSource(getCommandeDataSource(initialData));
    allOrders()
  }, []);

  const updateCommandeDataSource = (newData) => {
    setCommandeDataSource(getCommandeDataSource(newData));
  };
  
  const updateCommandeStatus = (commandeId, newStatus) => {
    setCommandeDataSource(prevDataSource => {
      const updatedDataSource = prevDataSource.map(commande => {
        if (commande.key === commandeId) {
          return { ...commande, status: newStatus };
        }
        return commande;
      });
      return updatedDataSource;
    });
  };

  //affichage du Tableau
  //toutes les commandes
  const getCommandeDataSource = (data) => {
    return data.columns["column-1"].taskIds.map((taskId) => {
      const task = data.tasks[taskId];
      return {
        key: task.id,
        numero_commande: task.content.numero_commande,
        client: task.content.client,
        prix_total: task.content.prix_total,
        produits: task.order.produits,
        date: task.order.date,
        status: task.order.status,
        magasin: task.order.magasin
      };
    });
  };

  const allOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/allOrders');
      const orders = response.data;
      //console.log('all orders',  orders)
      const orderData = transformOrderData(orders);
      console.log('all orders', orderData)
      //setCommandeDataSource(orderData);


      // ok - details de la commandes
    // // Récupérer les valeurs de l'objet orders (tableau de commandes)
    // const orderValues = Object.values(orders);

    // // Itérer sur les commandes
    // for (const order of orderValues[0]) {
    //   const orderId = order.orderId;
    //   // Appel à l'API pour récupérer les détails de la commande
    //   const orderResponse = await axios.get(`http://127.0.0.1:8080/getOrderProducts/${orderId}`);
    //   const orderData = orderResponse.data;
      
    //   // Utilisez les données de la commande comme souhaité
    //   console.log('Commande', orderId, ':', orderData);
    // }
     
    } catch (error) {
      console.error(error);
    }
  };

  //mise en forme data
  const transformOrderData = (orders) => {
    const orderArray = Object.values(orders);
    console.log(orderArray)
    return orderArray.map((order) => {
      return {
        key: order.orderId,
        numero_commande: order.numero_commande,
        client: order.firstname_client + ' ' + order.lastname_client,
        prix_total: order.prix_total,
        produits: order.productIds,
        date: order.date,
        status: order.status,
        magasin: order.storeId
      };
    });
  };
  

  
  // Définir les colonnes du tableau
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
    {
      title: "Prix total",
      dataIndex: "prix_total",
      key: "prix_total"
    },
    {
      title: "Passée le ",
      dataIndex: "date",
      key: "date"
    },
    {
      title:'Pain du Jour',
      dataIndex:'magasin', 
      key:'magasin'
    },
    {
      title:'Statut',
      dataIndex:'status', 
      key:'status',
      render: (text) => {
        let color = 'default';
        if (text === 'attente') {
          color = 'orange';
        }
        if (text === 'preparation') {
          color = 'blue';
        }
        if (text === 'pret') {
          color = 'green';
        }
        if (text === 'livree') {
          color = 'yellow';
        }
        if (text === 'annulee') {
          color = 'red';
        }
        return <Tag color={color}>{text}</Tag>;
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
    <div>
      <h3>Commandes</h3>
      
      <Tasks initialData={initialData} updateCommandeDataSource={updateCommandeDataSource} updateCommandeStatus={updateCommandeStatus}/>

      <Tabs className="tableau_commandes">

          <TabList>
             <Tab>Toutes les commandes</Tab>
             <Tab>Livrées</Tab>
             <Tab>Annulées</Tab>
           </TabList>

          <TabPanel>
                 <Table dataSource={commandeDataSource} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
          <TabPanel>
                 <Table dataSource={commandeDataSource.filter(commande => commande.status === 'livree')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
          <TabPanel>
                 <Table dataSource={commandeDataSource.filter(commande => commande.status === 'annulee')} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
          
           

         </Tabs>

      
    </div>
  );
}

export default CommandePage;