import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag } from "antd";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const UsersPage = () => {

  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [clients, setClients] = useState([]); 


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAll`);
        const filteredClients = response.data.filter(client => 
          client.role === "client" || client.role === "SUNcollaborateur"
        );
        console.log(filteredClients);
        setClients(filteredClients); 

        
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  //tableau
const columns = [
  {
    title: "Nom",
    dataIndex: "lastname",
    key: "lastname"
  },
  {
    title: "Prénom",
    dataIndex: "firstname",
    key: "firstname"
  },
 
]
  return (
    <div className="content_client">

      <Table dataSource={clients} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />

    </div>
    
  )
}

export default UsersPage