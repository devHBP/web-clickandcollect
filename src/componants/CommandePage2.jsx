import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tasks from './Tasks2';

function CommandePageSimple() {
  const [commandes, setCommandes] = useState([]);
  

  useEffect(() => {
    
    allOrders()
  }, []);

  const allOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/allOrders');
      const orders = response.data.orders;
      //console.log('resp', response)
      //console.log('all orders',  orders)
      const orderData = transformOrderData(orders);
      console.log('orderdata', orderData)
      setCommandes(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  //mise en forme data
  const transformOrderData = (orders) => {
    const orderArray = Object.values(orders);
    console.log(orderArray)
   
    return {
       
       
        tasks: orderArray.reduce((acc, order) => {
            const productIdsArray = order.productIds.split(","); // Convertir la chaîne de caractères en tableau
       
          acc[order.numero_commande] = {
            key: order.orderId,
            numero_commande: order.numero_commande,
            client: order.firstname_client + ' ' + order.lastname_client,
            prix_total: order.prix_total,
            nombre_produits: productIdsArray.length,
          };
          return acc;
        }, {}),
        columns: {
          "column-1": {
            id: "column-1",
            title: "Commandes en attente",
            taskIds: orderArray.filter(order => order.status === 'en attente').map(order => order.numero_commande),
          },
          "column-2": {
            id: "column-2",
            title: "Commandes en préparation",
            taskIds: orderArray.filter(order => order.status === 'preparation').map(order => order.numero_commande),
          },
          "column-3": {
            id: "column-3",
            title: "Commandes prêtes à récupérer",
            taskIds: orderArray.filter(order => order.status === 'prete').map(order => order.numero_commande),
          }
        },
        columnOrder: ["column-1", "column-2", "column-3"]
      };
    
  };
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

    const start = commandes.columns[source.droppableId];
    const finish = commandes.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...commandes,
        columns: {
          ...commandes.columns,
          [newColumn.id]: newColumn,
        },
      };

      setCommandes(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
        ...commandes,
        columns: {
          ...commandes.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
  
      setCommandes(newState);

}
  

  

  return (
    <div className="commande-page">
      <Tasks commandes={commandes} onDragEnd={onDragEnd} />
    </div>
  );
}

export default CommandePageSimple;
