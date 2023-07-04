import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Colums from './Colums2';

function Tasks({ commandes }) {
  const onDragEnd = (result) => {
    // TODO: Mettez à jour l'état des commandes en fonction du résultat du glisser-déposer
  };

  return (
    <div className='tasks'>
        <DragDropContext onDragEnd={onDragEnd}>
        
        <Colums title="En Attente" commandes={commandes && commandes.columns && commandes.columns['column-1'] ? commandes.columns['column-1'].taskIds.map(id => commandes.tasks[id]) : []} />
<Colums title="Préparation" commandes={commandes && commandes.columns && commandes.columns['column-2'] ? commandes.columns['column-2'].taskIds.map(id => commandes.tasks[id]) : []} />
<Colums title="Prêtes" commandes={commandes && commandes.columns && commandes.columns['column-3'] ? commandes.columns['column-3'].taskIds.map(id => commandes.tasks[id]) : []} />

    </DragDropContext>
    </div>
    
  );
}

export default Tasks;
