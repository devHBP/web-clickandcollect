import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Table, Tag} from 'antd'
import 'react-tabs/style/react-tabs.css';
import {AiOutlineEye} from "react-icons/ai";
import  Tasks  from './Tasks';

const CommandePage = () => {

  const Open = (record) => { 
    console.log(record)
 }
  const dataSource = [
    {
      key: '1',
      numero: '#1',
      client:'User 1',
      date:'01/01/2023',
      produits:'4',
      statut:'En cours',
      magasin:'Mas Guerido'
    },
    {
      key: '2',
      numero: '#2',
      client:'User 2',
      date:'01/02/2023',
      produits:'2',
      statut:'Validée',
      magasin:'Mas Guerido'
    },
    ,
    {
      key: '3',
      numero: '#3',
      client:'User 2',
      date:'02/02/2023',
      produits:'3',
      statut:'Terminé',
      magasin:'Mas Guerido'
    }
  ];
  const columns = [
    {
      title: 'Numéro',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title:'Passée le',
      dataIndex:'date', 
      key:'date'
    },
    {
      title:'Produits',
      dataIndex:'produits', 
      key:'produits'
    },
    {
      title:'Statut',
      dataIndex:'statut', 
      key:'statut',
      render: (text) => {
        let color = 'default';
        if (text === 'En cours') {
          color = 'orange';
        }
        if (text === 'Validée') {
          color = 'blue';
        }
        if (text === 'Terminé') {
          color = 'green';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title:'Pain du Jour',
      dataIndex:'magasin', 
      key:'magasin'
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
    
  ]
  

  return (
    <div>
        <h3>Commandes</h3>

        <Tabs className="tableau_commandes">

          <TabList>
            <Tab>Toutes les commandes</Tab>
            <Tab>En cours</Tab>
            <Tab>Validées</Tab>
            <Tab>Terminées</Tab>
          </TabList>

          <TabPanel>
            
          <Table 
                dataSource={dataSource} 
                columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 4 }}  />
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 3</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 4</h2>
          </TabPanel>

        </Tabs>

        <p style={{textAlign:'center'}}>Autre test : Drag and drop</p>

       <Tasks />
       
              
    </div>
    
  )
}

export default CommandePage