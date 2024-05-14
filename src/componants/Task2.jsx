import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiFillCaretDown } from "react-icons/ai";
import { GiReceiveMoney, GiCardExchange } from "react-icons/gi";

import { Tag, Modal, Select } from "antd";
import axios from "axios";
import "../styles/styles.css";
import { ProduitAntigaspi } from "../../SVG/ProduitAntigaspi";
import ModaleInfo from "./ModaleInfo";
import ModaleUpdateOrder from "./ModaleUpdateOrder";
import toast, { Toaster } from "react-hot-toast";

function Task({
  commande,
  index,
  updateOrderStatus,
  updateNewOrdersCount,
  updateCommandeData,
}) {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [showDetails, setShowDetails] = useState(false);
  const [isTaskReady, setIsTaskReady] = useState(commande.status === "attente");
  const [isViewed, setIsViewed] = useState(commande.view);
  const [openModaleInfo, setOpenModaleInfo] = useState(false);
  const [openModaleUpdateOrder, setOpenModaleUpdateOrder] = useState(false);
  const [prefAlim, setPrefAlim] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [refunds, setRefunds] = useState(commande.cartString.map(() => "non"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempRefunds, setTempRefunds] = useState([...refunds]);
  const [selectedQuantities, setSelectedQuantities] = useState(
    commande.cartString.map((item) => item.qty)
  );
  const [productDetails, setProductDetails] = useState({
    option1: null,
    option2: null,
    option3: null,
  });

  useEffect(() => {
    setIsTaskReady(commande.status === "prete");
    // console.log(commande);
  }, [commande.status]);

  useEffect(() => {
    setIsViewed(commande.view);
  }, [commande.view]);

  useEffect(() => {
    setTempRefunds([...refunds]);
  }, [refunds, commande.cartString, commande.productIds]);

  const toggleDetails = async () => {
    console.log('commande',commande)

    setShowDetails(!showDetails);
    if (!showDetails) {
      try {
        // Charger les détails du produit
        const productResponse = await axios.get(
          `${baseUrl}/getOrderProducts/${commande.orderID}`
        );

        // Mise à jour des détails de la commande
        commande.productDetails = productResponse.data;

        // console.log('Détails chargés:', commande);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails de la commande",
          error
        );
      }
    }
  };

  const handleDelivery = async () => {
    const status = "livree";

    try {
      const response = await axios.put(
        `${baseUrl}/updateStatusOrder/${commande.key}`,
        { status }
      );
      updateOrderStatus(commande.key, status);
      //console.log('commande livrée')
      //envoi de l'email de feedback
      const sendEmail = async () => {
        try {
          const res = await axios.post(`${baseUrl}/feedback`, {
            email: commande.email,
            firstname: commande.firstname,
            numero_commande: commande.numero_commande,
            date: commande.date,
            point_de_vente: commande.magasin,
          });
        } catch (error) {
          console.error("An error occurred while sending the email:", error);
        }
      };
      sendEmail();
    } catch (error) {
      console.error(
        "An error occurred while updating the order status:",
        error
      );
    }
  };

  const handleCancelPopup = async (record) => {
    Modal.confirm({
      title: `Etes vous sur d'annuler cette commande : ${commande.key} ?`,
      onOk: () => {
        handleCancel();
      },
    });
  };
  const handleCancel = async () => {
    const status = "annulee";

    try {
      const response = await axios.post(`${baseUrl}/cancelOrder`, {
        orderId: commande.key,
      });
      updateOrderStatus(commande.key, status);
    } catch (error) {
      console.error(
        "An error occurred while updating the order status:",
        error
      );
    }
  };

  const handleRefund = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setRefunds(tempRefunds);
    const articlesToRefund = tempRefunds
      .map((refund, index) =>
        refund === "oui" ? commande.cartString[index] : null
      )
      .filter((item) => item !== null)
      .map((item) => ({
        libelle: item.libelle,
        prix_unitaire: item.prix_unitaire,
        qty: selectedQuantities,
        productId: item.productId,
      }));

    // Préparer l'objet à envoyer
    const dataToSend = {
      orderId: commande.orderID,
      client: commande.client,
      date: commande.date,
      articles: articlesToRefund,
    };

    //console.log(dataToSend);
    // SOUCI ICI: la qty des produits articles [1,1] : pourquoi un tableau

    const productIdsToRefund = articlesToRefund.map((item) => item.productId);
    const updateData = {
      orderId: commande.orderID,
      refundedProductIds: productIdsToRefund,
    };

    const updateOrder = async () => {
      try {
        const response = await axios.put(
          `${baseUrl}/updateOrderContent`,
          updateData
        );
        //console.log(response.data);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour de la commande:",
          error
        );
      }
    };
    updateOrder();

    // Envoi de l'email
    const sendEmail = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/refundArticle`,
          dataToSend
        );
        //console.log(response.data);
        toast.success("Email envoyé!");
      } catch (error) {
        toast.error("Email non envoyé");
        // console.error("An error occurred while sending the email:", error);
      }
    };
    if (articlesToRefund.length > 0) {
      sendEmail();
    }
    setShowDetails(false);
  };

  const handleCancelModale = () => {
    setIsModalVisible(false);
  };

  const handleSelectChange = (value, index) => {
    const newRefunds = [...tempRefunds];
    newRefunds[index] = value;
    setTempRefunds(newRefunds);
  };
  const handleQuantityChange = (value, index) => {
    const newQuantities = [...selectedQuantities];
    newQuantities[index] = value;
    setSelectedQuantities(newQuantities);
  };

  const handleView = async () => {
    // console.log(commande);
    try {
      // Mets à jour le status "view"
      const response = await axios.put(
        `${baseUrl}/updateViewStatus/${commande.orderID}`
      );
      // console.log('Statut de vue de la commande mis à jour', response.data);
      setIsViewed(true);
      updateNewOrdersCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la mise à jour du statut de vue :",
        error
      );
    }
  };
  const handleMoreInfo = async () => {
    setOpenModaleInfo(true);
    try {
      const getInfo = await axios.get(
        `${baseUrl}/getInfoAlimentaire/${commande.userId}`
      );
      const reponse = getInfo.data;
      setPrefAlim(reponse.preferencesAlimentaires);
      setAllergies(reponse.allergies);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la recupération des infos du user :",
        error
      );
    }
  };

  const fetchProductDetails = async (optionId, optionKey) => {
    if (optionId) {
      try {
        const response = await axios.get(
          `${baseUrl}/getOneProduct/${optionId}`
        );
        setProductDetails((prevDetails) => ({
          ...prevDetails,
          [optionKey]: response.data,
        }));
      } catch (error) {
        console.error(`Error fetching ${optionKey} product details:`, error);
      }
    }
  };

  useEffect(() => {
    const formuleItem = commande.cartString.find(
      (item) =>
        item.option1ProductId || item.option2ProductId || item.option3ProductId
    );
    if (formuleItem) {
      fetchProductDetails(formuleItem.option1ProductId, "option1");
      fetchProductDetails(formuleItem.option2ProductId, "option2");
      fetchProductDetails(formuleItem.option3ProductId, "option3");
    }
  }, [commande.cartString]);
  //calcul nb de produits
  // Calcule le nombre total de produits dans la commande
  // const getTotalProductCount = (cartString) => {
  //   return cartString.reduce((total, item) => total + item.qty, 0);
  // };

  // Utilisation pour déterminer le texte à afficher
  // const totalProductCount = getTotalProductCount(commande.cartString);
  // const productText = totalProductCount === 1 ? "Produit" : "Produits";

  const handleUpdateOrder = () => {
    setOpenModaleUpdateOrder(true);
  };
  return (
    <>
      <Draggable draggableId={commande.numero_commande} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task_item"
          >
            {!isViewed && (
              <div className="warning-badge" onClick={handleView}>
                !
              </div>
            )}
            <AiFillCaretDown
              className="details_order"
              onClick={toggleDetails}
            />

            <div className="row_order">
              <div className="divMoreInfo">
                <div className="task_number">{commande.orderID}</div>
                <p className="iconInfo" onClick={handleMoreInfo}>
                  ℹ
                </p>
                {openModaleInfo && (
                  <ModaleInfo
                    setOpenModaleInfo={setOpenModaleInfo}
                    userName={commande.client}
                    prefAlim={prefAlim}
                    allergies={allergies}
                    userId={commande.userId}
                  />
                )}
                {commande.info === "remboursement" || commande.info === null ? (
                  <GiReceiveMoney />
                ) : (
                  <GiCardExchange />
                )}
              </div>
              <p>
                {commande.paid ? (
                  <Tag className="order_paid" color="green">
                    Payée
                  </Tag>
                ) : (
                  <Tag className="order_unpaid" color="red">
                    Non payée
                  </Tag>
                )}
              </p>
            </div>

            <div className="content_date_store">
              <div className="div_date">
                <p className="task_date">Passé le : {commande.createdDate}</p>
                <p className="task_date">Pour le : {commande.date}</p>
              </div>
              <div>
                <Tag className="task_magasin" color="grey">
                  {commande.magasin}
                </Tag>
              </div>
            </div>

            <div className="row_order">
              <div>
                Pour : <span className="task_client">{commande.client}</span>
              </div>
              <div className="task_products">
                {" "}
                <p>
                  {commande.nombre_produits}{" "}
                  {commande.nombre_produits > 1 ? "Produits" : "Produit"}
                </p>
              </div>
            </div>

            <div className="row_order">
              <div>Total: </div>
              <div className="row_total">
                <div className="task_total">{commande.prix_total} €</div>
              </div>
            </div>

            {showDetails && (
              <div className="second_part_order">
                <hr />
                <div className="details_second_part">
                  <div className="row_order">
                    <h4>Détails de la commande</h4>
                  </div>
                  {/* s'affiche seulement si heure rempli (null pour collaborateur) */}
                  {commande.heure && <p>Heure de retrait: {commande.heure}</p>}

                  <ul key={index}>
                    {/* Si newCartString est présent, affichez ces produits comme les actuels */}

                    {/* si cartString rempli */}
                    {commande.cartString ? (
                      commande.cartString.map((product, index) => (
                        <div key={product.id || index}>
                          {/* si c'est une formule */}
                          {product.type === "formule" ? (
                            <>
                              <p>
                                <strong>
                                  {product.quantity} x {product.libelle}
                                </strong>
                              </p>
                              <div className="details_formule">
                                {productDetails.option1 && (
                                  <div className="row_order">
                                    <p>
                                      {product.quantity}x{" "}
                                      {productDetails.option1.libelle}
                                    </p>
                                    <p>
                                      {productDetails.option1.prix_unitaire} €
                                    </p>
                                  </div>
                                )}
                                {productDetails.option2 && (
                                  <div className="row_order">
                                    <p>
                                      {product.quantity}x{" "}
                                      {productDetails.option2.libelle}
                                    </p>
                                    <p>
                                      {productDetails.option2.prix_formule} €
                                    </p>
                                  </div>
                                )}
                                {productDetails.option3 && (
                                  <div className="row_order">
                                    <p>
                                      {product.quantity}x{" "}
                                      {productDetails.option3.libelle}
                                    </p>
                                    <p>
                                      {productDetails.option3.prix_formule} €
                                    </p>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="row_order">
                                <p>
                                  {/* si c'est un produit antigaspi */}
                                  {product.type === "antigaspi" && (
                                    <span className="antigaspi-label">
                                      <ProduitAntigaspi /> Antigaspi - {""}
                                    </span>
                                  )}
                                  {product.quantity || product.qty} x{" "}
                                  {product.newLibelle ? (
                                    // si il y a eu un remplacement
                                    <span>
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                        }}
                                      >
                                        {product.product|| product.libelle}
                                      </span>{" "}
                                      <span>{product.newLibelle}</span>
                                    </span>
                                  ) : (
                                    <span>
                                        {product.product || product.libelle}

                                    </span>
                                  )}
                                </p>

                                <p>{product.totalPrice || product.prix_unitaire}€</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : // si cartstring null (si bug)
                    commande.productDetails &&
                      commande.productDetails.length > 0 ? (
                      commande.productDetails.map((product, index) => (
                        <p key={index}>
                          {product.quantity} x {product.libelle}
                        </p>
                      ))
                    ) : (
                      <div className="row_order">
                        <p>Aucun détail de produit disponible.</p>
                      </div>
                    )}
                  </ul>

                  <div className="row_order">
                    <p className="task_total_detail">Total:</p>
                    <p className="task_total"> {commande.prix_total} €</p>
                  </div>
                </div>
                <div className="viewContentButtons">
                  <div className="buttons">
                    <button
                      className="button_cancel"
                      onClick={() => handleCancelPopup(commande)}
                    >
                      Annuler
                    </button>
                    <button
                      className="button_delivery"
                      disabled={!isTaskReady}
                      onClick={handleDelivery}
                    >
                      Livrée
                    </button>
                  </div>
                  {/* bouton suivant le choix du user  */}
                  <div className="buttons">
                    {commande.info === "remboursement" ||
                    commande.info === null ? (
                      <button className="button_refund" onClick={handleRefund}>
                        Rembourser un article
                      </button>
                    ) : (
                      <button
                        className="button_refund"
                        onClick={handleUpdateOrder}
                      >
                        Remplacer un article
                      </button>
                    )}
                    {openModaleUpdateOrder && (
                      <ModaleUpdateOrder
                        setOpenModaleUpdateOrder={setOpenModaleUpdateOrder}
                        order={commande}
                        updateCommandeData={updateCommandeData}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Draggable>
      <Modal
        title="Demande de remboursement par mail ?"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancelModale}
        style={{ zIndex: 99 }}
      >
        <ul>
          {commande.cartString.map((item, index) => (
            <li key={index} className="contentSelectRefund">
              <Select
                defaultValue={selectedQuantities[index]}
                style={{ width: 60, marginLeft: 8 }}
                onChange={(value) => handleQuantityChange(value, index)}
              >
                {Array.from({ length: item.qty }, (_, i) => (
                  <Select.Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Select.Option>
                ))}
              </Select>
              {item.libelle}
              <Select
                defaultValue={tempRefunds[index]}
                style={{ width: 80, marginLeft: 8 }}
                onChange={(value) => handleSelectChange(value, index)}
              >
                <Select.Option value="oui">Oui</Select.Option>
                <Select.Option value="non">Non</Select.Option>
              </Select>
            </li>
          ))}
        </ul>

        {/* email deja envoyé */}
        {commande.productIds && commande.productIds.length > 0 ? (
          <Tag color="orange">Une demande a déjà été envoyée par email</Tag>
        ) : (
          ``
        )}
      </Modal>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default Task;
