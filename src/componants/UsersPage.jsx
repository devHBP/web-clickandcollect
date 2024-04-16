import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Select, Modal, Input, Spin } from "antd";
const { Option } = Select;
import { AiOutlineReload, AiOutlineRest } from "react-icons/ai";
import ModaleEditProfile from "./ModaleEditProfile";
const { Search } = Input;

const UsersPage = () => {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [clients, setClients] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {

      setIsLoading(true);
      try {
        const usersResponse = await axios.get(`${baseUrl}/getAll`);
        // Filtrez d'abord les utilisateurs pour ne conserver que les rôles "client" et "SUNcollaborateur"
        const filteredUsers = usersResponse.data.filter(
          (user) => user.role === "client" || user.role === "SUNcollaborateur"
        );

        // Pour chaque utilisateur filtré, récupérez la dernière commande
        const clientsWithLastOrderPromises = filteredUsers.map(
          async (client) => {
            const lastOrderResponse = await axios.get(
              `${baseUrl}/userOrders/${client.userId}`
            );
            // console.log(lastOrderResponse)
            return {
              ...client,
              lastOrder: lastOrderResponse.data
                ? lastOrderResponse.data.date
                : "X",
            }; // 'X' pour aucune commande
          }
        );

        const clientsWithLastOrder = await Promise.all(
          clientsWithLastOrderPromises
        );
        setClients(clientsWithLastOrder);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  //modifier le rôle de l'utilisateur
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${baseUrl}/updateRole/${userId}`, { role: newRole });
      // Mettre à jour l'état local pour refléter le changement
      setClients(
        clients.map((client) =>
          client.userId === userId ? { ...client, role: newRole } : client
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).toString() === "Invalid Date") {
      return "X";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleProfile = async (record) => {
    setOpen(true);
    setSelectedUser(record);
  };
  const handleClose = async (record) => {
    setOpen(false);
  };

  const handleReset = async (record) => {
    //console.log(record.userId)
    Modal.confirm({
      title: `Etes vous sur de supprimer cet utilisateur : ${record.firstname} ${record.lastname} ?`,
      onOk: () => {
        handleDelete(record.userId);
      },
    });
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("userToken");
      const tokenString = JSON.parse(token);

      const config = {
        headers: {
          "x-access-token": tokenString,
        },
      };
      const response = await axios.post(
        `${baseUrl}/deleteUserOrAnonymize/${userId}`,
        {}, // Corps vide, car nous n'avons rien à envoyer avec cette requête
        config // Configuration Axios, incluant les headers
      );

      // Vérifiez le statut de la réponse
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Actualisez votre état ici pour refléter la suppression du user
      const updatedUsers = clients.filter((user) => user.userId !== userId);
      setClients(updatedUsers);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      const token = localStorage.getItem("userToken");
      const tokenString = JSON.parse(token);

      const config = {
        headers: {
          "x-access-token": tokenString,
        },
      };
      const response = await axios.patch(
        `${baseUrl}/modifyUser/${userId}`,
        updateData,
        config
      );

      setClients(
        clients.map((client) =>
          client.userId === userId ? { ...client, ...updateData } : client
        )
      );
    } catch (error) {
      console.error("erreur modification du user:", error);
    }
  };

  const handleSearch = (e) => {
    console.log("search");
    setSearchTerm(e.target.value);
  };

  //tableau
  const columns = [
    {
      title: "Nom",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Prénom",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Téléphone",
      dataIndex: "telephone",
      key: "telephone",
      render: (text) => text || "X",
    },
    {
      title: "Statut",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(newRole) => handleRoleChange(record.userId, newRole)}
        >
          <Option value="client">Client</Option>
          <Option value="SUNcollaborateur">SUNCollab</Option>
          {/* <Option value="invite">Invité</Option> */}
        </Select>
      ),
    },

    {
      title: "Dernière commande",
      dataIndex: "lastOrder",
      key: "lastOrder",
      render: (lastOrder) => formatDate(lastOrder),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => (
        <>
          <div className="contentIconsUsers">
            <AiOutlineReload onClick={() => handleProfile(record)} />
            <AiOutlineRest onClick={() => handleReset(record)} />
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="pageUsersContent">
          <Search
            placeholder="Rechercher un utilisateur"
            size="large"
            style={{ width: 250 }}
            onChange={handleSearch}
          />

          <div className="content_client">
            <Table
              dataSource={clients.filter(
                (user) =>
                  user.firstname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.lastname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              columns={columns}
              rowKey="userId"
              pagination={{ position: ["bottomCenter"], pageSize: 5 }}
            />
          </div>
          {isOpen && (
            <ModaleEditProfile
              isOpen={isOpen}
              handleClose={handleClose}
              user={selectedUser}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UsersPage;
