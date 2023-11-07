import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag } from "antd";
import {AiOutlineEye} from "react-icons/ai";
import "../styles/styles.css";

function Resume() {
  const [tableData, setTableData] = useState([]);
  const [hasOrders, setHasOrders] = useState(true);
  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseUrl}/allOrders`);
      console.log(response.data)
      if (response.data.orders && response.data.orders.length === 0) {
        setHasOrders(false);
      } else {
        setHasOrders(true);
        setTableData(transformOrderData(response.data.orders));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setHasOrders(false);
    }
  };

  const transformOrderData = (orders) => {
    return orders.map((order) => ({
      key: order.orderId,
      numero_commande: order.orderId,
      client: `${order.firstname_client} ${order.lastname_client}`,
      prix_total: order.prix_total,
      status: order.status,
      magasin: order.storeName,
      date: new Date(order.date).toLocaleDateString(),
      email: order.email,
    }));
  };

  const columns = [
    {
      title: 'N° de commande',
      dataIndex: 'numero_commande',
      key: 'numero_commande',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Prix total',
      dataIndex: 'prix_total',
      key: 'prix_total',
    },
    
    {
      title: 'Passée le',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Livré', value: 'livree' },
        { text: 'Annulé', value: 'annulee' },
        { text: 'En attente', value: 'en attente' },
        // Ajoutez d'autres statuts si nécessaire
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color = 'default';
        if (status === 'en attente') color = 'orange';
        else if (status === 'preparation') color = 'blue';
        else if (status === 'prete') color = 'green';
        else if (status === 'livree') color = 'yellow';
        else if (status === 'annulee') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      key: 'action',
      title: 'Actions',
      render: (record) => (
        <>
          <AiOutlineEye onClick={() => viewOrder(record)} />
        </>
      ),
    },
  ];

  const viewOrder = (record) => {
    console.log('Viewing order:', record);
  };


  return (
    hasOrders ? (
      <div className="resume-page">
        <Table dataSource={tableData} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 6 }} />
      </div>
    ) : (
      <p>Pas de commandes</p>
    )
  );
}

export default Resume;
