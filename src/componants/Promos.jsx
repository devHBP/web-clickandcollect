import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Select } from "antd";
import { AiOutlineRest } from "react-icons/ai";
import ModaleAddPromo from "./ModaleAddPromo";
import { Add } from "../../SVG/Add";

export default function Promos() {
  const [elements, setElements] = useState([]);
  const [openModaleAddPromo, setOpenModaleAddPromo] = useState(false);

  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/promocodes`);
        console.log(response.data);
        setElements(response.data);
      } catch (error) {
        console.error("Une erreur s'est produite, promocodes :", error);
      }
    };

    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

  const updatePromo = (newCodes) => {
    setElements(newCodes);
  };

  //ajout handleAddProduct
  const handleAddPromo = async (newCode) => {
    console.log('new code', newCode)
    try {
      await axios.post(`${baseUrl}/promocodes`, newCode);
      const response = await axios.get(`${baseUrl}/promocodes`);
      const allPromosUpdates = response.data;
      // console.log('allPromosUpdates', allPromosUpdates)
      updatePromo(allPromosUpdates);
      setOpenModaleAddPromo(false);
      // console.log('promo ajouté')
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };
  const handleDeletePromo = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/deletepromocodes/${id}`);

      // Vérifiez le statut de la réponse
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Actualisez votre état ici pour refléter la suppression du produit
      const updatedPromos = elements.filter((promo) => promo.id !== id);
      const updatedResponse = await axios.get(`${baseUrl}/promocodes`);
      setElements(updatedResponse.data);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  const Delete = (record) => {
     console.log(record.promotionId)
    Modal.confirm({
      title: `Etes vous sur de supprimer cette promotion : ${record.code} ?`,
      onOk: () => {
        handleDeletePromo(record.promotionId);
      },
    });
  };

  // modification du statut du code promo : actif ou non
  const handleStatusChange = async (promotionId, newStatus) => {
    const isActive = newStatus === 'Oui';
    try {
      await axios.put(`${baseUrl}/updateStatusPromo`, { promotionId, active: isActive });
      // Mettez à jour l'état local
      const updatedElements = elements.map((promo) => 
        promo.promotionId === promotionId ? { ...promo, active: isActive } : promo
      );
      setElements(updatedElements);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du code promo :", error);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Pourcentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "fixedAmount",
      dataIndex: "fixedAmount",
      key: "fixedAmount",
    },
    {
      title: "Durée",
      dataIndex: "durationInDays",
      key: "durationInDays",
    },
    {
      title: "Actif",
      dataIndex: "active",
      key: "active",
      render: (active, record) => (
        <Select
          defaultValue={active ? 'Oui' : 'Non'}
          style={{ width: 80 }}
          onChange={(newStatus) => handleStatusChange(record.promotionId, newStatus)}
        >
          <Select.Option value="Oui">Oui</Select.Option>
          <Select.Option value="Non">Non</Select.Option>
        </Select>
      ),
    },
    {
      key: "action",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <AiOutlineRest onClick={() => Delete(record)} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <button
            onClick={() => setOpenModaleAddPromo(true)}
            className="button_add"
          >
            <Add />
            Ajouter un code promo
          </button>
        </div>
        <Table
          dataSource={elements}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 4 }}
          rowKey="promotionId"
          bordered
        />
      </div>
      {openModaleAddPromo && (
        <ModaleAddPromo
          setOpenModaleAddPromo={setOpenModaleAddPromo}
          handleAddPromo={handleAddPromo}
        />
      )}
    </>
  );
}
