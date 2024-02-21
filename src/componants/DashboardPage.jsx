import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "../styles/styles.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AiOutlineCalendar } from "react-icons/ai";

const DashboardPage = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [orders, setOrders] = useState([]);
  const [ordersFiltered, setOrdersFiltered] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [filteredOrdersCount, setFilteredOrdersCount] = useState(0);
  const [clientData, setClientData] = useState({ clients: [] });
  const [ordersFilterPeriod, setOrdersFilterPeriod] = useState("daily");
  const [salesFilterPeriod, setSalesFilterPeriod] = useState("daily");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const options = [
    { value: "daily", label: "Ce jour" },
    { value: "weekly", label: "Cette semaine" },
    { value: "monthly", label: "Ce mois" },
    { value: "total", label: "Total" },
  ];

  const [selectOptions, setSelectOptions] = useState(options);
  const [selectValue, setSelectValue] = useState(options[0]);

  // console.log('all Orders', orders)
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
    ordersInWaiting();
  }, [baseUrl]);

  useEffect(() => {
    filterSalesByPeriod();
  }, [salesFilterPeriod, orders]);

  //panier moyen
  const calculateAverageBasket = (orders) => {
    const totalAmount = orders.reduce(
      (sum, order) => sum + parseFloat(order.prix_total || 0),
      0
    );
    const averageAmount = orders.length > 0 ? totalAmount / orders.length : 0;
    setAverage(averageAmount);
  };

  //filtres du chiffre d'affaires
  const filterSalesByPeriod = () => {
    const now = new Date();
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return isWithinPeriod(orderDate, now, salesFilterPeriod);
    });

    const totalSalesAmount = filtered.reduce(
      (sum, order) => sum + parseFloat(order.prix_total || 0),
      0
    );
    setTotalVentes(totalSalesAmount);
  };

  //filtre des commandes
  // const filterOrdersByPeriod = (allOrders, period) => {
  //   const now = new Date();
  //   const filtered = allOrders.filter((order) => {
  //     const orderDate = new Date(order.createdAt);
  //     return isWithinPeriod(orderDate, now, period);
  //   });

  //   setFilteredOrdersCount(filtered.length);
  // };

  const filterOrdersByPeriod = (allOrders, period, specificDate = null) => {
    const now = new Date();
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.date);
      // console.log(order.date)
      if (specificDate) {
        // console.log('orderDate.toISOString()', orderDate.toISOString())
        // console.log('specificDate', specificDate)
        return orderDate.toISOString() === specificDate;
      } else {
        return isWithinPeriod(orderDate, now, period);
      }
    });

    setFilteredOrdersCount(filtered.length);
  };

  //cases du filtres
  const isWithinPeriod = (orderDate, now, period) => {
    switch (period) {
      case "daily":
        return orderDate.toDateString() === now.toDateString();
      case "weekly":
        const oneWeekAgo = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        return orderDate >= oneWeekAgo;
      case "monthly":
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return orderDate >= oneMonthAgo;
      default:
        return true;
    }
  };

  const handleSalesFilterChange = (selectedOption) => {
    setSalesFilterPeriod(selectedOption.value);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date) => {
    setShowCalendar(false);
    // console.log(date.toISOString())
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const format = utcDate.toISOString();
    // console.log(utcDate.toISOString())

    setSelectedDate(format);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 car les mois commencent à 0
    const year = date.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    // const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    // setSelectedDate(formattedDate); // Mettez à jour l'état selectedDate avec la date formatée
    setSelectedDate(date.toISOString()); // Mettez à jour l'état selectedDate avec la date formatée

    // console.log('date JJ-MM-YYYY', dateStr);
    const newOption = { value: "selectedDate", label: dateStr };
    setSelectOptions([...options, newOption]);
    setSelectValue(newOption);
    filterOrdersByPeriod(orders, "selectedDate", format);
  };

  const handleOrdersFilterChange = (selectedOption) => {
    // setOrdersFilterPeriod(selectedOption.value);
    // filterOrdersByPeriod(orders, selectedOption.value);
    setSelectValue(selectedOption); // Mettez à jour la valeur sélectionnée
    if (selectedOption.value === "selectedDate") {
      // Gérez la logique de filtrage pour la date sélectionnée
      const parts = selectedOption.label.split("-");
      const specificDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      filterOrdersByPeriod(orders, "selectedDate", specificDate);
    } else {
      setOrdersFilterPeriod(selectedOption.value);
      filterOrdersByPeriod(orders, selectedOption.value);
    }
  };

  const ordersInWaiting = async () => {

    try {
      const response = await axios.get(`${baseUrl}/ordersInWebApp`);
      let orders = response.data.orders;
      setOrdersFiltered(orders.length)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div className="content_dashboard">
      {/* 1ere partie */}
      <div className="first_part">
        <div className="highlight-box">
          <p>Commandes "En attente" : </p>
          <span>
            {
              ordersFiltered
            }
          </span>
        </div>
        <div className="highlight-box">
          <p>Commandes "Prêtes" : </p>
          <span>
            {orders.filter((order) => order.status === "prete").length}
          </span>
        </div>
      </div>

      {/* 2e partie  */}
      <div className="second_part">
        <div className="highlight-box">
          <p>Chiffre d'affaires : </p>
          <Select
            options={options}
            onChange={handleSalesFilterChange}
            value={options.find((option) => option.value === salesFilterPeriod)}
          />
          <span>{totalVentes.toFixed(2)}€</span>
        </div>
        <div className="highlight-box">
          <p>Nb de commandes Pour: </p>

          <div className="calendarRow">
            <Select
              // options={options}
              // onChange={handleOrdersFilterChange}
              // value={options.find(
              //   (option) => option.value === ordersFilterPeriod
              // )}
              options={selectOptions}
              onChange={handleOrdersFilterChange}
              value={selectValue}
            />
            <AiOutlineCalendar size={22} onClick={toggleCalendar} />
            <div className="calendar-container">
              {showCalendar && <Calendar onChange={handleDateSelect} />}
            </div>
          </div>

          <span>{filteredOrdersCount}</span>
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
          <p>Nb clients : </p>
          <span>
            {
              clientData.clients.filter(
                (client) =>
                  client.role === "client" || client.role === "SUNcollaborateur"
              ).length
            }
          </span>
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
