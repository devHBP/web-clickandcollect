import React from 'react'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd';

function Colums({column, tasks}) {
  // console.log(column)
  // console.log(tasks)
  return (
    <div className='tasks_column'>
      <h2 className='column-title'>{column.title}</h2>
      <Droppable droppableId={column.id}>
        { provider => (
          <div
          { ...provider.droppableProps} ref={provider.innerRef} className='tasks_list'>
              {
        tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index}/>
        ))
      }
          </div>
        )}
      
      </Droppable>
     
    </div>
  )
}

export default Colums