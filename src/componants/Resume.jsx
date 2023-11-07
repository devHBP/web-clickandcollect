import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Modal, List } from "antd";
import {AiOutlineEye} from "react-icons/ai";
import "../styles/styles.css";

function Resume() {
  const [tableData, setTableData] = useState([]);
  const [hasOrders, setHasOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [orderProducts, setOrderProducts] = useState([]); 

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

  const viewOrder = async (record) => {
    try {
      // Afficher un indicateur de chargement ici si vous le souhaitez
      const productsResponse = await axios.get(`${baseUrl}/getOrderProducts/${record.key}`);
      setOrderProducts(productsResponse.data); // Mettre à jour l'état avec les produits de la commande
      setSelectedOrder(record); // Mettre à jour l'état avec les détails de la commande
      setIsModalVisible(true); // Afficher la modale
    } catch (error) {
      console.error("Error fetching order products:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderOrderDetailsModal = () => {
    // Utilisez un formatage approprié pour la date et les autres données si nécessaire
    const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return (
      <Modal
        title={`Détails de la commande ${selectedOrder ? selectedOrder.numero_commande : ''}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p>Nom du client: {selectedOrder.firstname_client} {selectedOrder.lastname_client}</p>
            <p>N° de commande: {selectedOrder.numero_commande}</p>
            <p>Statut: 
              <Tag color={selectedOrder.status === 'annulee' ? 'red' : 'green'}>
                {selectedOrder.status}
              </Tag>
            </p>
            <p>Date de la commande: {new Date(selectedOrder.date).toLocaleDateString(undefined, dateFormat)}</p>
            <p>Heure de la commande: {selectedOrder.heure || 'Non spécifiée'}</p>
            <p>Prix total: {selectedOrder.prix_total}€</p>
            <p>Méthode de paiement: {selectedOrder.paymentMethod}</p>
            <p>Commande payée: {selectedOrder.paid ? 'Oui' : 'Non'}</p>
          </div>
        )}
        <List
          itemLayout="horizontal"
          dataSource={orderProducts}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.libelle}
                description={`Quantité : ${item.quantity}`}
              />
              <div>Prix : {item.prix}</div>
            </List.Item>
          )}
        />
      </Modal>
    );
  };


  // return (
  //   hasOrders ? (
  //     <div className="resume-page">
  //       <Table dataSource={tableData} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 6 }} />
  //     </div>
      
  //   ) : (
  //     <p>Pas de commandes</p>
  //   )
  // );
  return (
    hasOrders ? (
      <>
        <div className="resume-page">
          <Table dataSource={tableData} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 6 }} />
        </div>
        {renderOrderDetailsModal()}

      </>
    ) : (
      <p>Pas de commandes</p>
    )
  );
}

export default Resume;
