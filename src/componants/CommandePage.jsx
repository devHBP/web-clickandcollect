import React, { useState, useEffect} from "react";
import Tasks from "./Tasks";
import { Table, Tag } from "antd";
import {AiOutlineEye} from "react-icons/ai";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {initialData} from '../datas/datas'

function CommandePage() {

  //mise à jour données entre commandepage et tasks
  const [commandeDataSource, setCommandeDataSource] = useState([]);

  useEffect(() => {
    setCommandeDataSource(getCommandeDataSource(initialData));
  }, []);

  const updateCommandeDataSource = (newData) => {
    setCommandeDataSource(getCommandeDataSource(newData));
  };
  
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
      
      <Tasks initialData={initialData} updateCommandeDataSource={updateCommandeDataSource}/>

      <Tabs className="tableau_commandes">

          <TabList>
             <Tab>Toutes les commandes</Tab>
             
           </TabList>

           <TabPanel>
                 <Table dataSource={commandeDataSource} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }} />
          </TabPanel>
           

         </Tabs>

      
    </div>
  );
}

export default CommandePage;