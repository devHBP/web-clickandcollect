import React, { useState, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task2";
import Select from "react-select";
import axios from "axios";

function Colums({
  id,
  title,
  commandes,
  updateOrderStatus,
  updateNewOrdersCount,
  stores,
}) {
  useEffect(() => {}, [stores]);

  const [selectedStore, setSelectedStore] = useState(null);

  // Gérer le changement de magasin sélectionné
  const handleStoreChange = (selectedOption) => {
    setSelectedStore(selectedOption);
  };

  // Filtrer les commandes par magasin sélectionné
  const filteredCommandes = selectedStore
    ? commandes.filter((commande) => commande.magasin === selectedStore.label)
    : commandes;

  const storeOptions = Object.entries(stores).map(([key, value]) => {
    return { value: key, label: value };
  });

  const sortedCommandes = filteredCommandes.sort((a, b) =>
    new Date(a.date.split('/').reverse().join('-')).getTime() - 
    new Date(b.date.split('/').reverse().join('-')).getTime()
  );

  const formatDate = (dateString) => {
    if (dateString) {
      const dateParts = dateString.split('/');
      return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    } else {
      return 'Date inconnue';
    }
  }

//   const colors = ['#a6a2a2', '#e5e6e4']; 
// let lastDate = '';
// let colorIndex = 0;

// const getColorForDate = (dateString) => {
//   // Si la date change, alternez la couleur
//   if (dateString !== lastDate) {
//     colorIndex = 1 - colorIndex; // Change l'indice de couleur
//     lastDate = dateString; // Mettre à jour la dernière date traitée
//   }
//   return colors[colorIndex]; // Retourne la couleur actuelle
// };
//  ;
  

  //console.log(commandes);

  return (
    <div className="flex-container">
      <div id={id} className="column">
        <h3>{title}</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "200px" }}>
            <Select
              options={storeOptions}
              onChange={handleStoreChange}
              value={selectedStore}
              placeholder="Filtrer par magasin"
              isClearable
            />
          </div>
        </div>

        {/* 1er test */}
        {/* <Droppable droppableId={id} >
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className='tasks_list' style={{ minHeight: "100vh" }}>
            {commandes.map((commande, index) => (
             commande ? <Task key={commande.key} commande={commande} index={index} updateOrderStatus={updateOrderStatus} updateNewOrdersCount={updateNewOrdersCount} 
             /> : null
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable> */}

        {/* sans date */}
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tasks_list"
              style={{ minHeight: "100vh" }}
            >
              {/* {filteredCommandes.map((commande, index) =>
                commande ? (
                  <Task
                    key={commande.key}
                    commande={commande}
                    index={index}
                    updateOrderStatus={updateOrderStatus}
                    updateNewOrdersCount={updateNewOrdersCount}
                  />
                ) : null
              )} */}
              {sortedCommandes.reduce((acc, commande, index) => {
                  if (!commande) return acc;

            // Vérifiez si la commande actuelle a une date différente de la commande précédente
            const commandeDate = formatDate(commande.date);
           
            // const taskColor = getColorForDate(commandeDate); 
            if (index === 0 || formatDate(sortedCommandes[index - 1]?.date) !== commandeDate) {
              // Si oui, ajoutez un nouvel en-tête de date
              acc.push(<h4 key={commandeDate} className="dateGroup">{commandeDate}</h4>);
            }
            // Ajoutez la commande actuelle
            acc.push(
              <Task
                key={commande.key}
                commande={commande}
                index={index}
                updateOrderStatus={updateOrderStatus}
                updateNewOrdersCount={updateNewOrdersCount}
                // color={taskColor}
              />
            );
            return acc;
          }, [])}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export default Colums;
