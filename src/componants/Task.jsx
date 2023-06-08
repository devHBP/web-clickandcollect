import React from "react"
import { Draggable } from "react-beautiful-dnd"

function Task({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task_item"
        >
              <div>Numéro de commande: {task.content.numero_commande}</div>
              <div>Client: {task.content.client}</div>
        </div>
      )}
    </Draggable>
  )
}

export default Task
