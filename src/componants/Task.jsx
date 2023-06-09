import React, { useState} from "react"
import { Draggable } from "react-beautiful-dnd"
import {AiFillCaretDown} from "react-icons/ai";
AiFillCaretDown

function Task({ task, index }) {

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
    console.log(task)
  }
  return (
    <Draggable draggableId={task.id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task_item"
        >
              <AiFillCaretDown className="details_order" onClick={toggleDetails}/>
              <div className="first_part_order">
                <p>Numéro de commande: {task.content.numero_commande}</p>
                <p>Client: {task.content.client}</p>
                <p>Nb de produits: {task.order.produits.length}</p>
                <p>Prix total: {calculateTotalPrice(task.order.produits)} euros</p>
              </div>
              {showDetails && (
                <div className="second_part_order">
                  <h4>Détails de la commande</h4>
                   {/* <p>Nb de produits: {task.order.produits.length}</p> */}
                  <ul>
                {task.order.produits.map((produit) => (
                  <li key={produit.id} className="list_order">
                    {produit.quantite}x{produit.nom} 
                  </li>
                ))}
                 <p>Passée le: {task.order.date}</p>
              </ul>
                </div>
          )}
              
        </div>
      )}
    </Draggable>
  )
}

function calculateTotalPrice(produits) {
  let total = 0;
  produits.forEach((produit) => {
    total += produit.quantite * produit.prix_unitaire;
  });
  return total;
}

export default Task
