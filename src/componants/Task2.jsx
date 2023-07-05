import React, { useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {AiFillCaretDown} from "react-icons/ai";

function Task({ commande, index }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isTaskReady, setIsTaskReady] = useState(commande.status === "attente");

  const toggleDetails = () => {
    setShowDetails(!showDetails)
    console.log(commande)
  }

  return (
    <Draggable draggableId={commande.numero_commande} index={index}>
      {(provided) => (
       
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="task_item">
           <AiFillCaretDown className="details_order" onClick={toggleDetails}/>
          <div className="task-number">{commande.numero_commande}</div>
            <div className="task-client">{commande.client}</div>
            <div className="task-client">Total Commande: {commande.prix_total} euros</div>
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
              
                
                </div>
          )}
            
            
          
  
        </div>
      )}
    </Draggable>
  );
}

export default Task;
