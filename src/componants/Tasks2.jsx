import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Colums from "./Colums2";
import "../styles/styles.css";

function Tasks({
  commandes,
  onDragEnd,
  updateOrderStatus,
  decrementNewOrders,
}) {
  return (
    <div className="tasks">
      <DragDropContext onDragEnd={onDragEnd}>
        <Colums
          id="column-1"
          title="En Attente "
          commandes={
            commandes && commandes.columns && commandes.columns["column-1"]
              ? commandes.columns["column-1"].taskIds.map(
                  (id) => commandes.tasks[id]
                )
              : []
          }
          updateOrderStatus={updateOrderStatus}
          decrementNewOrders={decrementNewOrders}
        />

        {/* <Colums id="column-2" title="Préparation" commandes={commandes && commandes.columns && commandes.columns['column-2'] ? commandes.columns['column-2'].taskIds.map(id => commandes.tasks[id]) : []} updateOrderStatus={updateOrderStatus} socket={socket}/> */}

        <Colums
          id="column-3"
          title="Prêtes"
          commandes={
            commandes && commandes.columns && commandes.columns["column-3"]
              ? commandes.columns["column-3"].taskIds.map(
                  (id) => commandes.tasks[id]
                )
              : []
          }
          updateOrderStatus={updateOrderStatus}
        />
      </DragDropContext>
    </div>
  );
}

export default Tasks;
