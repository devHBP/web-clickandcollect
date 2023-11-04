import React, { useState, useEffect} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {AiFillCaretDown} from "react-icons/ai";
import axios from 'axios'

function Task({ commande, index, updateOrderStatus, socket }) {

  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [showDetails, setShowDetails] = useState(false)
  const [isTaskReady, setIsTaskReady] = useState(commande.status === "attente");

  useEffect(() => {
    setIsTaskReady(commande.status === "prete");
  }, [commande.status]);

  const toggleDetails = () => {
    setShowDetails(!showDetails)
    //console.log(commande)
  }
  const handleDelivery = async () => {
    const status = 'livree';
   
    try {
      const response = await axios.put(`${baseUrl}/updateStatusOrder/${commande.key}`, { status });
      updateOrderStatus(commande.key, status);
      //console.log('commande livrée')
      //envoi de l'email de feedback
      const sendEmail = async () => {
        try {
          // Assurez-vous que user.email et user.firstname sont accessibles à partir de cet endroit du code.
          const res = await axios.post(`${baseUrl}/feedback`, {
              email: commande.email, 
              firstname: commande.firstname,
              numero_commande: commande.numero_commande,
              date: commande.date,
              point_de_vente: commande.magasin
          });
        } catch (error) {
          console.error("An error occurred while sending the email:", error);
        }
      };
      sendEmail();
    } catch (error) {
      console.error('An error occurred while updating the order status:', error);
    } 
  };
  const handleCancel = async () => {
    const status = 'annulee';
 
    try {
      const response = await axios.post(`${baseUrl}/cancelOrder`, { orderId: commande.key });
      updateOrderStatus(commande.key, status);

      // if (socket && socket.readyState === WebSocket.OPEN) {
      //   const message = JSON.stringify({ type: 'updatedOrder', data: { orderId: commande.key, status } });
      //   socket.send(message);
      // }

    } catch (error) {
      console.error('An error occurred while updating the order status:', error);
    }
  }

  return (
    <Draggable draggableId={commande.numero_commande} index={index}>
      {(provided) => (
       
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="task_item">
           <AiFillCaretDown className="details_order" onClick={toggleDetails}/>
          <div className="task-number">{commande.numero_commande}</div>
            <div className="task-client">{commande.client}</div>
            <div className="task-client">Total Commande: {commande.prix_total} euros</div>
            <div className="task-client">Email: {commande.email}</div>
            <div className="task-products">Nombre de produits: {commande.nombre_produits}</div>

            {showDetails && (
                <div className="second_part_order">
                  <h4>Détails de la commande</h4>
                   {/* <p>Nb de produits: {task.order.produits.length}</p> */}
                  <ul>
                  {commande.productDetails.map(product => (
                    <div key={product.productId}>
                      <p key={product.productId}>{product.quantity}x  {product.libelle} </p>
                      {/* Render other product details here */}
                    </div>
                  ))}
                      <p>Magasin: {commande.magasin}</p>
                      <p>Date: {commande.date}</p>
                      {/* s'affiche seulement si heure rempli (null pour collaborateur) */}
                      {commande.heure && <p>Heure de retrait: {commande.heure}</p>}
                  </ul>
                  <div className="buttons">
                    <button className="button_delivery"  disabled={!isTaskReady} onClick={handleDelivery}>Livrée</button>
                    <button className="button_cancel"  onClick={ handleCancel}>Annulée</button>
                  </div>
                </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
