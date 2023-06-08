import React, { useState } from "react";
import Column from "./Colums";
import { DragDropContext } from "react-beautiful-dnd";

function Tasks() {
  const initialData = {
    tasks: {
      "task-1": {
        id: "task-1",
        content: {
          numero_commande: "#1",
          client: "Client 1",
        },
        color: "blue",
      },
      "task-2": {
        id: "task-2",
        content: {
          numero_commande: "#2",
          client: "Client 2",
        },
        color: "blue",
      },
      "task-3": {
        id: "task-3",
        content: {
          numero_commande: "#3",
          client: "Client 3",
        },
        color: "blue",
      },
      "task-4": {
        id: "task-4",
        content: {
          numero_commande: "#4",
          client: "Client 4",
        },
        color: "blue",
      },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "A traiter",
        taskIds: ["task-1", "task-2", "task-3", "task-4"],
      },
      "column-2": {
        id: "column-2",
        title: "En cours",
        taskIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "Terminé",
        taskIds: [],
      },
    },
    // Pour mieux organiser nos futures colonnes
    columnOrder: ["column-1", "column-2", "column-3"],
  };

  const [datas, setDatas] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // on check la possition si c'est pas en dehors du cadre - sinon on arrete l'execution de la fonction
    if (!destination) {
      return;
    }

    // on check si la destination n'est pas la meme que la source
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // partie 2 multiples colonnes
    // on check si la colonne source et la meme que la colonne de destination

    const start = datas.columns[source.droppableId];
    const finish = datas.columns[destination.droppableId];

    // Si on bouge les éléments dans une autre colonne
    const startTaskIds = Array.from(start.taskIds);
    const finishTaskIds = Array.from(finish.taskIds);

    // Supprimer la tâche déplacée de la colonne source
    const updatedStartTaskIds = startTaskIds.filter(
      (taskId) => taskId !== draggableId
    );
    // Ajouter la tâche déplacée à la colonne de destination
    const updatedFinishTaskIds = [...finishTaskIds, draggableId];

    const newStart = {
      ...start,
      taskIds: updatedStartTaskIds,
    };

    const newFinish = {
      ...finish,
      taskIds: updatedFinishTaskIds,
    };

    const newState = {
      ...datas,
      columns: {
        ...datas.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setDatas(newState);
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
