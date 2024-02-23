import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Modal, List } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import "../styles/styles.css";
import { ProduitAntigaspi } from "../../SVG/ProduitAntigaspi";
import * as XLSX from "xlsx";


function Resume() {
  const [tableData, setTableData] = useState([]);
  const [hasOrders, setHasOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [filteredOrderCount, setFilteredOrderCount] = useState(0);
  const [ordersFetch, setOrdersFetch] = useState([]);

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]);

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

  const getLibelle = async (productIds) => {
    try {
      const ids = productIds.split(','); // Diviser la chaîne en un tableau d'IDs
      const libelles = await Promise.all(ids.map(async (id) => {
        const response = await axios.get(`${baseUrl}/getOneProduct/${id}`);
        return response.data.libelle; // Retourne le libellé pour chaque produit
      }));
      return libelles.join('\n'); // Concatène tous les libellés avec un saut de ligne
    } catch (error) {
      console.error("Error fetching product details:", error);
      return "Détail(s) produit(s) inconnu(s)";
    }
  }
  
  
  const fetchOrders = async () => {
    const query = `?startDate=${startDate}&endDate=${endDate}`;
   
    try {
      // const response = await axios.get(`${baseUrl}/allOrders`);
      const response = await axios.get(`${baseUrl}/ordersByDate${query}`);
      // console.log(response.data);
      if (new Date(startDate) > new Date(endDate)) {
        setTableData([]);
        return; 
      }
      setOrdersFetch(response.data)
      if (response.data.orders && response.data.orders.length === 0) {
        setHasOrders(false);
        setTableData([]);
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

 

  const handleExport = async () => {
    console.log(ordersFetch)
    // Vérifiez si ordersFetch contient des commandes à exporter
    if (!ordersFetch.orders || ordersFetch.orders.length === 0) {
      console.log("Aucune commande à exporter");
      return;
    }
  
    // Récupérez les noms des magasins pour chaque commande
    const ordersWithStoreNames = await Promise.all(ordersFetch.orders.map(async (order) => {
      const nom_magasin = await fetchStoreDetails(order.storeId);
      const libelle = await getLibelle(order.productIds);

      return { ...order, nom_magasin, libelle };
    }));

    // Filtrer uniquement les commandes payées
  const paidOrders = ordersWithStoreNames.filter(order => order.paid);

  
    // Préparez les données à exporter
    const ordersToExport = paidOrders.map(order => {
      const date = new Date(order.date);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
  
      return {
        "N° Commande": order.orderId,
        "Client": `${order.firstname_client} ${order.lastname_client}`,
        "Magasin": order.nom_magasin, // Utilisez le nom du magasin enrichi
        "Total commande": order.prix_total,
        "Pour le": formattedDate,
        "Status": order.status,
        "Produits": order.libelle
      };
    });
  
    // Exportez les données vers Excel
    const ws = XLSX.utils.json_to_sheet(ordersToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commandes");
    XLSX.writeFile(wb, `Export_Commandes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  


  const transformOrderData = (orders) => {
    //console.log(orders)
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
      promotionId:order.promotionId
    }));
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  //filtre par client
  const generateUsersFilters = (orders) => {
    const clients = new Set(orders.map((order) => order.client));
    return Array.from(clients).map((client) => ({
      text: client,
      value: client,
    }));
  };

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
      filters: generateUsersFilters(tableData),
      onFilter: (value, record) => record.client === value,
      filterSearch: true,
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
      title: "Payé ?",
      dataIndex: "paid",
      key: "paid",    
      render: (text, record) => (
        record.paid 
          ? <Tag color="green">Oui</Tag> 
          : <Tag color="volcano">Non</Tag>
      ),
      filters: [
        { text: 'Oui', value: true },
        { text: 'Non', value: false },
      ],      
      onFilter: (value, record) => record.paid === value,

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
            {
              selectedOrder.promotionId && 
              <p>Promotion utilisée: {selectedOrder.promotionId}</p>
            }
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

  return (
    <>
      <div className="resume-page">
        <div className="inputSearch">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {/* <button onClick={fetchOrders} className="button">Rechercher</button> */}
          <button onClick={handleExport} className="button">
          Exporter
        </button>
        </div>

        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 6 }}
          onChange={handleTableChange}
        />
        <div className="totalFiltered">
          <p>
            Total : <span className="spanFiltered">{filteredOrderCount}</span>
          </p>
        </div>
      </div>
      {renderOrderDetailsModal()}
    </>
  );
}

export default Resume;
