import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "../styles/styles.css";

const DashboardPage = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [orders, setOrders] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [filteredOrdersCount, setFilteredOrdersCount] = useState(0);
  const [clientData, setClientData] = useState({ clients: [] });
  const [ordersFilterPeriod, setOrdersFilterPeriod] = useState("daily");
  const [salesFilterPeriod, setSalesFilterPeriod] = useState("daily");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get(`${baseUrl}/allOrders`);
        const clientsResponse = await axios.get(`${baseUrl}/getAll`);

        if (ordersResponse.data.orders) {
          setOrders(ordersResponse.data.orders);
          calculateAverageBasket(ordersResponse.data.orders);
          filterOrdersByPeriod(ordersResponse.data.orders, "daily"); 
        }

        setClientData({ clients: clientsResponse.data });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  useEffect(() => {
    filterSalesByPeriod();
  }, [salesFilterPeriod, orders]);

  //panier moyen
  const calculateAverageBasket = (orders) => {
    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.prix_total || 0), 0);
    const averageAmount = orders.length > 0 ? totalAmount / orders.length : 0;
    setAverage(averageAmount);
  };

  //filtres du chiffre d'affaires
  const filterSalesByPeriod = () => {
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isWithinPeriod(orderDate, now, salesFilterPeriod);
    });

    const totalSalesAmount = filtered.reduce((sum, order) => sum + parseFloat(order.prix_total || 0), 0);
    setTotalVentes(totalSalesAmount);
  };

  //filtre des commandes 
  const filterOrdersByPeriod = (allOrders, period) => {
    const now = new Date();
    const filtered = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isWithinPeriod(orderDate, now, period);
    });

    setFilteredOrdersCount(filtered.length);
  };

  //cases du filtres
  const isWithinPeriod = (orderDate, now, period) => {
    switch (period) {
      case "daily":
        return orderDate.toDateString() === now.toDateString();
      case "weekly":
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      case "monthly":
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return orderDate >= oneMonthAgo;
      default:
        return true;
    }
  };

  const handleOrdersFilterChange = (selectedOption) => {
    setOrdersFilterPeriod(selectedOption.value);
    filterOrdersByPeriod(orders, selectedOption.value);
  };

  const handleSalesFilterChange = (selectedOption) => {
    setSalesFilterPeriod(selectedOption.value);
  };

  const options = [
    { value: "daily", label: "Ce jour" },
    { value: "weekly", label: "Cette semaine" },
    { value: "monthly", label: "Ce mois" },
    { value: "total", label: "Total" },
  ];

  return (
    <div className="content_dashboard">


        {/* 1ere partie */}
        <div className="first_part">
          <div className="highlight-box">
            <p>Commandes "En attente" : </p>
            <span>
              {
                orders.filter(
                  (order) => order.status === "en attente"
                ).length
              }
            </span>
          </div>
          <div className="highlight-box">
            <p>Commandes "Prêtes" : </p>
            <span>
              {
                orders.filter((order) => order.status === "prete")
                  .length
              }
            </span>
          </div>
          <div className="highlight-box">
            <p>Nombre de commandes : </p>

            <Select
            options={options}
            onChange={handleOrdersFilterChange}
            value={options.find((option) => option.value === ordersFilterPeriod)}
          />
          <span>{filteredOrdersCount}</span>
          </div>
        </div>

        {/* 2e partie  */}
        <div className="second_part">
          <div className="highlight-box">
            <p>Nb clients : </p>
            <span>
              {
                clientData.clients.filter(
                  (client) =>
                    client.role === "client" ||
                    client.role === "SUNcollaborateur"
                ).length
              }
            </span>
          </div>
          {/* <div className="highlight-box">
            <p>Horaires d'affluence</p>
          </div> */}
        </div>
        {/* 3e partie  */}
        <div className="third_part">
          <div className="highlight-box">
            <p>Panier moyen : </p>
            <span>{average.toFixed(2)}€</span>
          </div>
          <div className="highlight-box">
            <p>Chiffre d'affaires : </p>
            <Select
              options={options}
              onChange={handleSalesFilterChange}
              value={options.find(
                (option) => option.value === salesFilterPeriod
              )}
            />
            <span>{totalVentes.toFixed(2)}€</span>
          </div>
        </div>
        {/* 4e partie */}
        {/* <div className="fourth">
          <div className="highlight-box">
            <p>Top 5 ventes </p>
          </div>
        </div> */}
   
    </div>
  );
};

export default DashboardPage;
