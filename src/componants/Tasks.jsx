import React, { useState, useEffect } from "react";
import Column from "./Colums";
import { DragDropContext } from "react-beautiful-dnd";
// import {initialData} from '../datas/datas'

function Tasks({initialData, updateCommandeDataSource}) {

  const [datas, setDatas] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = datas.columns[source.droppableId];
    const finishColumn = datas.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      // Déplacement dans la même colonne
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds
      };

      const newColumns = {
        ...datas.columns,
        [newColumn.id]: newColumn
      };

      const newState = {
        ...datas,
        columns: newColumns
      };

      setDatas(newState);
    } else {
      // Déplacement entre différentes colonnes
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds
      };

      const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds
      };

      const newColumns = {
        ...datas.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      };

      const newState = {
        ...datas,
        columns: newColumns
      };

      

      //mise à jour du status de la commande au dnd dans une autre colonne
      if (finishColumn.id === "column-2") {
        newState.tasks[draggableId].order.status = "preparation";
      } else if (finishColumn.id === "column-3") {
        newState.tasks[draggableId].order.status = "pret";
      } else if (finishColumn.id === "column-1") {
        newState.tasks[draggableId].order.status = "attente";
       }

      setDatas(newState);
      updateCommandeDataSource(initialData);
    }
  };

 

  return (
    <div className="tasks">
      <DragDropContext onDragEnd={onDragEnd}>
        {datas.columnOrder.map((columnId) => {
          const column = datas.columns[columnId];
          const tasks = column.taskIds.map((taskId) => datas.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    </div>
  );
}

export default Tasks;