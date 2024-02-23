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
  const [showCalendarsales, setShowCalendarSales] = useState(false);
  const [topProducts, setTopProducts] = useState([]);


  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateOrders, setSelectedDateOrders] = useState(null);

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
        }

        setClientData({ clients: clientsResponse.data });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // chiffre d'affaire du jour
    const getDailySales = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/getSalesToday`);
        setTotalVentes(data.totalSales ?? 0);
      } catch (error) {
        console.error("Error fetching daily sales data:", error);
        setTotalVentes(0);
      }
    };
    //nb de vente du jour
    const getDailyOrder = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/getOrderToday`);
        setFilteredOrdersCount(data.count ?? 0);
      } catch (error) {
        console.error("Error fetching daily sales data:", error);
        setTotalVentes(0);
      }
    };

    // panier moyen
    const fetchAverageBasket = async () => {
      try {
        const response = await axios.get(`${baseUrl}/calculateAverageBasket`);
        setAverage(response.data.averageBasket);
      } catch (error) {
        console.error("Error fetching average basket:", error);
      }
    };

    // top 3 vente
    const getTopProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getTopSoldProducts`);
        setTopProducts(response.data)
      } catch (error) {
        console.error("Error fetching average basket:", error);
      }
    };

    fetchAverageBasket();
    fetchOrders();
    ordersInWaiting();
    getDailySales();
    getDailyOrder();
    getTopProducts();
  }, [baseUrl]);

  const handleSalesFilterChange = async (selectedOption) => {
    let apiUrl;
    switch (selectedOption.value) {
      case "daily":
        apiUrl = `${baseUrl}/getSalesToday`;
        break;
      case "weekly":
        apiUrl = `${baseUrl}/getSalesWeek`;
        break;
      case "monthly":
        apiUrl = `${baseUrl}/getSalesMonth`;
        break;
      case "total":
        apiUrl = `${baseUrl}/getTotalSales`;
        break;
      default:
        apiUrl = `${baseUrl}/getSalesToday`;
    }
    try {
      const { data } = await axios.get(apiUrl);
      setTotalVentes(data.totalSales);
      setSalesFilterPeriod(selectedOption.value);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const toggleCalendarSales = () => {
    setShowCalendarSales(!showCalendarsales);
  };

  const handleDateSelect = async (date) => {
    setShowCalendar(false);
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const format = utcDate.toISOString();

    setSelectedDateOrders(format);
    try {
      const response = await axios.get(`${baseUrl}/getOrdersByDate/${format}`);
      const ordersCount =
        response.data.ordersCount != null ? response.data.ordersCount : 0;
      setFilteredOrdersCount(ordersCount);
    } catch (error) {
      console.error("Error fetching orders data for the selected date:", error);
    }
  };

  const handleDateSelectSales = async (date) => {
    setShowCalendarSales(false);
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const format = utcDate.toISOString();

    setSelectedDate(format);
    try {
      const response = await axios.get(`${baseUrl}/getSalesByDate/${format}`);
      const sales =
        response.data.totalSales != null ? response.data.totalSales : 0;
      setTotalVentes(sales);
    } catch (error) {
      console.error("Error fetching sales data for the selected date:", error);
    }
  };

  const handleOrdersFilterChange = async (selectedOption) => {
    let apiUrl;
    switch (selectedOption.value) {
      case "daily":
        apiUrl = `${baseUrl}/getOrderToday`;
        break;
      case "weekly":
        apiUrl = `${baseUrl}/getOrderWeek`;
        break;
      case "monthly":
        apiUrl = `${baseUrl}/getOrderMonth`;
        break;
      case "total":
        apiUrl = `${baseUrl}/getTotalOrders`;
        break;
      default:
        apiUrl = `${baseUrl}/getTotalOrders`;
    }
    try {
      const { data } = await axios.get(apiUrl);
      setFilteredOrdersCount(data.count);
      setOrdersFilterPeriod(selectedOption.value);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const ordersInWaiting = async () => {
    try {
      const response = await axios.get(`${baseUrl}/ordersInWebApp`);
      let orders = response.data.orders;
      setOrdersFiltered(orders.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="content_dashboard">
      {/* 1ere partie */}
      <div className="first_part">
        <div className="highlight-box">
          <p>Commandes "En attente" : </p>
          <span>{ordersFiltered}</span>
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

          <div className="calendarRow">
            <Select
              options={options}
              onChange={handleSalesFilterChange}
              value={options.find(
                (option) => option.value === salesFilterPeriod
              )}
            />
            <AiOutlineCalendar size={22} onClick={toggleCalendarSales} />
            <div className="calendar-container">
              {showCalendarsales && (
                <Calendar onChange={handleDateSelectSales} />
              )}
            </div>
            <span>{totalVentes.toFixed(2)}€</span>
          </div>
        </div>

        <div className="highlight-box">
          <p>Nb de commandes Pour: </p>

          <div className="calendarRow">
            <Select
              options={selectOptions}
              onChange={handleOrdersFilterChange}
              value={options.find(
                (option) => option.value === ordersFilterPeriod
              )}
            />
            <AiOutlineCalendar size={22} onClick={toggleCalendar} />
            <div>
              {showCalendar && <Calendar onChange={handleDateSelect} />}
            </div>

            <span>{filteredOrdersCount}</span>
          </div>
        </div>
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
      <div className="fourth">
          <div className="highlight-box2">
            <p>Top 3 ventes </p>
            <ul>
            {topProducts.map((product, index) => (
              <li key={index}>
                <span>{product.libelle}</span> /  Vendu: {product.count}
              </li>
            ))}
          </ul>          </div>
        </div>
    </div>
  );
};

export default DashboardPage;
