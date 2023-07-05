import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task2';

function Colums({ id, title, commandes }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className='tasks_list'>
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
