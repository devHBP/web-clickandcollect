import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Modal, List } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import "../styles/styles.css";
import { ProduitAntigaspi } from "../../SVG/ProduitAntigaspi";

function Resume() {
  const [tableData, setTableData] = useState([]);
  const [hasOrders, setHasOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [filteredOrderCount, setFilteredOrderCount] = useState(0);

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mets à jour le compte des commandes filtrées
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (extra.action === "filter") {
      setFilteredOrderCount(extra.currentDataSource.length);
    }
  };

  const fetchStoreDetails = async (storeId) => {
    try {
      const response = await axios.get(`${baseUrl}/getOneStore/${storeId}`);
      return response.data.nom_magasin;
    } catch (error) {
      console.error("Error fetching store details:", error);
      return null;
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseUrl}/allOrders`);
      // console.log(response.data);
      if (response.data.orders && response.data.orders.length === 0) {
        setHasOrders(false);
      } else {
        const ordersWithStoreNames = await Promise.all(
          response.data.orders.map(async (order) => {
            const nom_magasin = await fetchStoreDetails(order.storeId);
            return { ...order, nom_magasin };
          })
        );
        setHasOrders(true);
        // setTableData(transformOrderData(response.data.orders));
        setTableData(transformOrderData(ordersWithStoreNames));
        setFilteredOrderCount(ordersWithStoreNames.length); 
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
      magasin: order.storeId,
      // date: new Date(order.date).toLocaleDateString(),
      email: order.email,
      userId: order.userId,
      firstname: order.firstname_client,
      lastname: order.lastname_client,
      paymentMethod: order.paymentMethod,
      paid: order.paid,
      createdAt: order.createdAt,
      cartString: order.cartString,
      date: order.date,
      nom_magasin: order.nom_magasin,
    }));
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // filtre par magasin
  const generateStoreFilters = (orders) => {
    const uniqueStores = new Set(orders.map((order) => order.nom_magasin));
    return Array.from(uniqueStores).map((store) => ({
      text: store,
      value: store,
    }));
  };
  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // filtre par date de commande passée
  const generateDateOrderFilters = (orders) => {
    const uniqueDates = new Set(
      orders.map((order) => normalizeDate(order.createdAt))
    );
    return Array.from(uniqueDates).map((date) => ({
      text: formatDate(date),
      value: date,
    }));
  };

  //filtre par date de commande livrée
  const generateDateLivraisonFilters = (orders) => {
    const dateLivraison = new Set(orders.map((order) => order.date));
    return Array.from(dateLivraison).map((date) => ({
      text: formatDate(date),
      value: date,
    }));
  };

  const columns = [
    {
      title: "N° Commande",
      dataIndex: "numero_commande",
      key: "numero_commande",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Magasin",
      dataIndex: "nom_magasin",
      key: "nom_magasin",
      filters: generateStoreFilters(tableData),
      onFilter: (value, record) => record.nom_magasin === value,
    },
    {
      title: "Prix total",
      dataIndex: "prix_total",
      key: "prix_total",
    },
    {
      title: "Passée le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
      filters: generateDateOrderFilters(tableData),
      onFilter: (value, record) => normalizeDate(record.createdAt) === value,
    },
    {
      title: "Pour le",
      dataIndex: "date",
      key: "date",
      render: (text) => formatDate(text),
      filters: generateDateLivraisonFilters(tableData),
      onFilter: (value, record) => record.date === value,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "En attente", value: "en attente" },
        { text: "Livrées", value: "livree" },
        { text: "Prêtes", value: "prete" },
        { text: "Annulées", value: "annulee" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color = "default";
        if (status === "en attente") color = "orange";
        // else if (status === 'preparation') color = 'blue';
        else if (status === "prete") color = "green";
        else if (status === "livree") color = "yellow";
        else if (status === "annulee") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      key: "action",
      title: "Actions",
      render: (record) => (
        <>
          <AiOutlineEye onClick={() => viewOrder(record)} />
        </>
      ),
    },
  ];

  const viewOrder = async (record) => {
    // console.log('UserId:', record.userId);
    try {
      const productsResponse = await axios.get(
        `${baseUrl}/getOrderProducts/${record.key}`
      );
      // console.log("Order products:", productsResponse.data);
      setOrderProducts(productsResponse.data); 
      setSelectedOrder({ ...record, products: productsResponse.data }); 
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
      case "en attente":
        return "orange";
      case "preparation":
        return "blue";
      case "prete":
        return "green";
      case "livree":
        return "yellow";
      case "annulee":
        return "red";
      default:
        return "default";
    }
  };

  const renderOrderDetailsModal = () => {
    // Utilisez un formatage approprié pour la date et les autres données si nécessaire
    const dateFormat = { year: "numeric", month: "2-digit", day: "2-digit" };
    let productsInCart = [];

    if (selectedOrder && selectedOrder.cartString) {
      try {
        // Si cartString est une chaîne JSON, convertissez-la en objet JavaScript
        productsInCart = JSON.parse(selectedOrder.cartString);
        // console.log('json', productsInCart)
      } catch (error) {
        console.error(
          "Erreur lors de la conversion de cartString en JSON",
          error
        );
      }
    }
    return (
      <Modal
        title={`Détails de la commande ${
          selectedOrder ? selectedOrder.numero_commande : ""
        }`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="modalDetails"
      >
        {selectedOrder && (
          <div>
            <p>
              Nom du client: {selectedOrder.lastname} {selectedOrder.firstname}
            </p>
            <p>N° de commande: {selectedOrder.numero_commande}</p>
            <p>
              Statut:
              <Tag
                color={getStatusTagColor(selectedOrder.status)}
                className="tagOrder"
              >
                {selectedOrder.status}
              </Tag>
            </p>
            <p>
              Date de la commande:{" "}
              {new Date(selectedOrder.date).toLocaleDateString(
                undefined,
                dateFormat
              )}
            </p>
            <p>Passée le : {formatDate(selectedOrder.createdAt)}</p>
            {/* <p>Date de la commande : {selectedOrder.date}</p> */}
            {/* <p>Heure de la commande: {selectedOrder.heure || 'Non spécifiée'}</p> */}
            <p>Prix total: {selectedOrder.prix_total}€</p>
            <p>
              Méthode de paiement:{" "}
              {selectedOrder.paymentMethod === "onsite"
                ? "Sur place"
                : "En ligne"}
            </p>
            <p>Commande payée: {selectedOrder.paid ? "Oui" : "Non"}</p>
          </div>
        )}
        <List
          itemLayout="horizontal"
          dataSource={orderProducts}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <>
                    {/* {item.antigaspi && <span className="pastilleAntigapiResume"><ProduitAntigaspi /></span>  } */}
                    {item.quantity} x {item.libelle}
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    );
  };

  return hasOrders ? (
    <>
      <div className="resume-page">
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 8 }}
          onChange={handleTableChange} 
        />
        <div className="totalFiltered">
          <p>Total : <span className="spanFiltered">{filteredOrderCount}</span></p>
        </div>
      </div>
      {renderOrderDetailsModal()}
    </>
  ) : (
    <p>Pas de commandes</p>
  );
}

export default Resume;
