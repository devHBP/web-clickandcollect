import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Task({ commande, index }) {
  return (
    <Draggable draggableId={commande.numero_commande} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="task_item">
          <div className="task-number">{commande.numero_commande}</div>
            <div className="task-client">{commande.client}</div>
            <div className="task-client">Total Commande: {commande.prix_total} euros</div>
            <div className="task-products">Nombre de produits: {commande.nombre_produits}</div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
