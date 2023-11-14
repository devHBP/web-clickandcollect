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
      //console.log(response.data)
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
      userId: order.userId,
      firstname: order.firstname_client,
      lastname: order.lastname_client,
      paymentMethod: order.paymentMethod,
      paid:order.paid,

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
        { text: 'En attente', value: 'en attente' },
        { text: 'Livrées', value: 'livree' },
        { text: 'Prêtes', value: 'prete' },
        { text: 'Annulées', value: 'annulee' },


      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color = 'default';
        if (status === 'en attente') color = 'orange';
        // else if (status === 'preparation') color = 'blue';
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
    console.log('Selected order for viewing:', record);
    try {
      // Si votre backend supporte la récupération d'une commande spécifique par son ID
      const productsResponse = await axios.get(`${baseUrl}/getOrderProducts/${record.key}`);
      console.log('Order products:', productsResponse.data);
      setOrderProducts(productsResponse.data); // Mettre à jour l'état avec les produits de la commande
      setSelectedOrder({ ...record, products: productsResponse.data }); // Mettre à jour l'état avec les détails de la commande et les produits
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'en attente':
        return 'orange';
      case 'preparation':
        return 'blue';
      case 'prete':
        return 'green';
      case 'livree':
        return 'yellow';
      case 'annulee':
        return 'red';
      default:
        return 'default';
    }
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
        className='modalDetails'
      >
        {selectedOrder && (
          <div>
            <p>Nom du client: {selectedOrder.lastname} {selectedOrder.firstname}</p>
            <p>N° de commande: {selectedOrder.numero_commande}</p>
            <p>Statut:  
            <Tag color={getStatusTagColor(selectedOrder.status)} className='tagOrder'>
              {selectedOrder.status}
            </Tag>
            </p>
            <p>Date de la commande: {new Date(selectedOrder.date).toLocaleDateString(undefined, dateFormat)}</p>
            {/* <p>Heure de la commande: {selectedOrder.heure || 'Non spécifiée'}</p> */}
            <p>Prix total: {selectedOrder.prix_total}€</p>
            <p>Méthode de paiement: {selectedOrder.paymentMethod === 'onsite' ? 'Sur place' : "En ligne"}</p>
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
            </List.Item>
          )}
        />
      </Modal>
    );
  };


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
