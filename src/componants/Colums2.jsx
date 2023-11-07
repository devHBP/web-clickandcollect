import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task2';

function Colums({ id, title, commandes, updateOrderStatus, socket }) {
  return (
    <div className="flex-container">

    <div id={id} className="column">
      <h3>{title}</h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className='tasks_list'>
            {commandes.map((commande, index) => (
             commande ? <Task key={commande.key} commande={commande} index={index} updateOrderStatus={updateOrderStatus}/> : null
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
    </div>
    </div>
  );
}

export default Colums;
