import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiFillCaretDown } from "react-icons/ai";
import axios from "axios";
import "../styles/styles.css";
import { ProduitAntigaspi } from "../../SVG/ProduitAntigaspi";

function Task({ commande, index, updateOrderStatus, updateNewOrdersCount}) {
  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [showDetails, setShowDetails] = useState(false);
  const [isTaskReady, setIsTaskReady] = useState(commande.status === "attente");
  const [isViewed, setIsViewed] = useState(commande.view);


  useEffect(() => {
    setIsTaskReady(commande.status === "prete");
  }, [commande.status]);

  useEffect(() => {
    setIsViewed(commande.view);
  }, [commande.view]);
  
  const toggleDetails = async () => {
    setShowDetails(!showDetails);
    if (!showDetails) {
      try {
        // Charger les détails du produit
        const productResponse = await axios.get(`${baseUrl}/getOrderProducts/${commande.orderID}`);
  
        // Mise à jour des détails de la commande
        commande.productDetails = productResponse.data;
  
        // console.log('Détails chargés:', commande);
      } catch (error) {
        console.error("Erreur lors du chargement des détails de la commande", error);
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

  const handleView = async () => {
    console.log(commande)
    try {
      // Mets à jour le status "view" 
      const response = await axios.put(`${baseUrl}/updateViewStatus/${commande.orderID}`);
      // console.log('Statut de vue de la commande mis à jour', response.data);
      setIsViewed(true);
      updateNewOrdersCount(prevCount => prevCount > 0 ? prevCount - 1 : 0); 

     
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour du statut de vue :", error);
    }
  };

  return (
    <Draggable draggableId={commande.numero_commande} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task_item"
        >
          { !isViewed &&  <div className="warning-badge" onClick={handleView}>!</div>}
          <AiFillCaretDown className="details_order" onClick={toggleDetails} />
          {/* <div className="task-number">{commande.numero_commande}</div> */}
          {/* <div className="task-client">Email: {commande.email}</div> */}

          <div className="row_order">
            <div className="task_number">{commande.orderID}</div>
            <p>
              {commande.paid ? (
                <span className="order_paid"> Payée</span>
              ) : (
                <span className="order_unpaid"> Non payée</span>
              )}
            </p>
          </div>

          <div className="row_order">
            <p className="task_date">{commande.date}</p>
            <div>
              Magasin: <span className="task_magasin">{commande.magasin}</span>
            </div>
          </div>

          <div className="row_order">
            <div>
              Pour : <span className="task_client">{commande.client}</span>
            </div>
            <div className="task_products">
              {" "}
              {commande.nombre_produits}{" "}
              {commande.nombre_produits === 1 ? "Produit" : "Produits"}{" "}
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
                  <div className="task_products">
                    {" "}
                    {commande.nombre_produits}{" "}
                    {commande.nombre_produits === 1 ? "Produit" : "Produits"}{" "}
                  </div>
                </div>
                {/* s'affiche seulement si heure rempli (null pour collaborateur) */}
                {commande.heure && <p>Heure de retrait: {commande.heure}</p>}

                <ul>
                  {/* si cartString rempli */}
                  {commande.cartString ? (
                    commande.cartString.map((product, index) => (
                      <div key={product.id || index}>
                        {/* si c'est une formule */}
                        {product.type === "formule" ? (
                          <>
                            <p>
                              <strong>
                                {product.qty} x {product.libelle}
                              </strong>
                            </p>
                            <div className="details_formule">
                              {product.option1 && (
                                <div className="row_order">
                                  <p> 1 x {product.option1.libelle}</p>
                                  <p>{product.option1.prix_unitaire} €</p>
                                </div>
                              )}
                              {product.option2 && (
                                <div className="row_formule">
                                  <p> 1 x {product.option2.libelle}</p>
                                  <p>{product.option2.prix_formule} €</p>
                                </div>
                              )}
                              {product.option3 && (
                                <div className="row_formule">
                                  <p> 1 x {product.option3.libelle}</p>
                                  <p>{product.option3.prix_formule} €</p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="row_order">
                              <p>
                                {/* si c'est un produit antigaspi */}
                                {product.antigaspi && (
                                  <span className="antigaspi-label">
                                    <ProduitAntigaspi /> Antigaspi - {""}
                                  </span>
                                )}
                                {product.qty} x {product.libelle}
                              </p>

                              <p>{product.prix_unitaire}€</p>
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
              <div className="row_order">
                <button className="button_cancel" onClick={handleCancel}>
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
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
