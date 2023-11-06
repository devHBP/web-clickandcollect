import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';

import "../styles/dashboard.css";

const DashboardPage = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [ordersData, setOrdersData] = useState({
    orders: [],
    average: 0,
    totalVentes: 0,
  });
  const [clientData, setClientData] = useState({ clients: [] });
  const [filterPeriod, setFilterPeriod] = useState("daily");
  const [salesFilterPeriod, setSalesFilterPeriod] = useState('daily');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/allOrders`);
        setOrdersData((prevData) => ({
          ...prevData,
          orders: response.data.orders,
        }));

        const resp = await axios.get(`${baseUrl}/getAll`);
        setClientData({
          clients: resp.data,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  useEffect(() => {
    //filtrage du chiffre d'affaires
    const filterOrdersBySalesPeriod = () => {
      const now = new Date();
      let filteredOrders = ordersData.orders;

      switch (salesFilterPeriod) {
        case "daily":
          filteredOrders = filteredOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === now.toDateString();
          });
          break;
        case "weekly":
          filteredOrders = filteredOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const oneWeekAgo = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 7
            );
            return orderDate > oneWeekAgo;
          });
          break;
        case "monthly":
          filteredOrders = filteredOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const oneMonthAgo = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return orderDate > oneMonthAgo;
          });
          break;
        default:
          break;
      }
      updateSalesData(filteredOrders);
    };

    filterOrdersBySalesPeriod();
  }, [salesFilterPeriod, ordersData.orders]);

  //panier moyen
  const updateSalesData = (filteredOrders) => {
    const totalVentes = filteredOrders.reduce((acc, order) => {
      const prixTotalAsNumber = parseFloat(order.prix_total);
      return acc + (isNaN(prixTotalAsNumber) ? 0 : prixTotalAsNumber);
    }, 0);
    const average = filteredOrders.length > 0 ? totalVentes / filteredOrders.length : 0;

    setOrdersData((prevData) => ({
      ...prevData,
      average,
      totalVentes,
    }));
  };

// filtrage des commandes
const getFilteredOrdersCount = () => {
  const now = new Date();
  let filteredOrders;

  switch (filterPeriod) {
    case "daily":
      filteredOrders = ordersData.orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === now.toDateString();
      });
      break;
    case "weekly":
      filteredOrders = ordersData.orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const oneWeekAgo = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        return orderDate > oneWeekAgo;
      });
      break;
    case "monthly":
      filteredOrders = ordersData.orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return orderDate > oneMonthAgo;
      });
      break;
    // case "total":
    //   filteredOrders = ordersData.orders;
    //   break;
    default:
      filteredOrders = ordersData.orders;
      break;
  }
  return filteredOrders.length;
};

  const handleSelectChange = selectedOption => {
    setFilterPeriod(selectedOption.value);
  };

  const handleSalesSelectChange = selectedOption => {
    setSalesFilterPeriod(selectedOption.value);
  };

  const options = [
    { value: 'daily', label: 'Ce jour' },
    { value: 'weekly', label: 'Cette semaine' },
    { value: 'monthly', label: 'Ce mois' },
    { value: 'total', label: 'Total' }
  ];

  return (
    <div className="content_dashboard">
      
      <div className="content_analytics">
        <h2>Analyses Le Pain du Jour - Mas Guérido</h2>
        

        {/* 1ere partie */}
        <div className="first_part">
          <div className="highlight-box">
            <p>Commandes "En attente" : </p>
            <span>
              {
                ordersData.orders.filter(
                  (order) => order.status === "en attente"
                ).length
              }
            </span>
          </div>
          <div className="highlight-box">
            <p>Commandes "Prêtes" : </p>
            <span>
              {
                ordersData.orders.filter((order) => order.status === "prete")
                  .length
              }
            </span>
           
          </div>
          <div className="highlight-box">
            <p>Nombre de commandes : </p>
            <span>{getFilteredOrdersCount()}</span>

          <Select 
            options={options} 
            onChange={handleSelectChange} 
            value={options.find(option => option.value === filterPeriod)} 
          />
            
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
          <div className="highlight-box">
            <p>Horaires d'affluence</p>
          </div>
        </div>
        {/* 3e partie  */}
        <div className="third_part">
          <div className="highlight-box">
            <p>Panier moyen : </p>
            <span>{ordersData.average.toFixed(2)}€</span>
          </div>
          <div className="highlight-box">
          <p>Chiffre d'affaires : </p>
          <span>{ordersData.totalVentes.toFixed(2)}€</span>
          <Select 
            options={options} 
            onChange={handleSalesSelectChange} 
            value={options.find(option => option.value === salesFilterPeriod)} 
          />
        </div>
        </div>
        {/* 4e partie */}
        <div className="fourth">
          <div className="highlight-box">
            <p>Top 5 ventes </p>
          </div>
        </div>
      </div>
    </div>
  );

            }

export default DashboardPage;
