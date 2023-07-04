import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task2';

function Colums({ title, commandes }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      <Droppable droppableId={title}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {commandes.map((commande, index) => (
              <Task key={commande.key} commande={commande} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Colums;
