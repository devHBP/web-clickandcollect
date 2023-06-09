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
          client: "1",
          prix_total:'12'
        },
        order: {
          produits: [
            {
              id: "produit-1",
              nom: "Salade César",
              quantite: 1,
              prix_unitaire: 5
            },
            {
              id: "produit-2",
              nom: "Brownie",
              quantite: 1,
              prix_unitaire: 8
            },
            {
              id: "produit-3",
              nom: "Coca Cola",
              quantite: 1,
              prix_unitaire: 1.50
            }
          ],
          date:"06-06-2023",
          status:'attente'
        }
      },
      "task-2": {
        id: "task-2",
        content: {
          numero_commande: "#2",
          client: "2",
          prix_total:'12'
        },
        order: {
          produits: [
            {
              id: "produit-1",
              nom: "Article 1",
              quantite: 2,
              prix_unitaire: 5
            },
            {
              id: "produit-2",
              nom: "Article 2",
              quantite: 3,
              prix_unitaire: 8
            },
          ],
          date:"06-06-2023",
          status:'attente'
        }
      },
      "task-3": {
        id: "task-3",
        content: {
          numero_commande: "#3",
          client: "3",
          prix_total:'12'
        },
        order: {
          produits: [
            {
              id: "produit-1",
              nom: "Article 1",
              quantite: 2,
              prix_unitaire: 5
            },
            {
              id: "produit-2",
              nom: "Article 2",
              quantite: 3,
              prix_unitaire: 8
            }, 
          ],
          date:"06-06-2023",
          status:'attente'
        },
      }
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "A traiter",
        taskIds: ["task-1", "task-2", "task-3"],
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