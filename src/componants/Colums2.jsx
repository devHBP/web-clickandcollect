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


  useEffect(() => {

  }, [stores]);

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

   // Grouper les commandes par date
   const commandesGroupedByDate = filteredCommandes
   .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')))
   .reduce((acc, commande) => {
     // Formater la date comme vous le souhaitez, ici en format DD/MM/YYYY
     const dateParts = commande.date.split('/');
     const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`; 
 
     // Initialiser un nouveau groupe pour cette date
     if (!acc[formattedDate]) {
       acc[formattedDate] = []; 
     }
     acc[formattedDate].push(commande);
     return acc;
   }, {});

  console.log(commandes)

  return (
    <div className="flex-container">
      <div id={id} className="column">
        <h3>{title}</h3>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
        <div style={{width:"200px"}}>
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
        {/* <Droppable droppableId={id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tasks_list"
              style={{ minHeight: "100vh" }}
            >
              {filteredCommandes.map((commande, index) =>
                commande ? (
                  <Task
                    key={commande.key}
                    commande={commande}
                    index={index}
                    updateOrderStatus={updateOrderStatus}
                    updateNewOrdersCount={updateNewOrdersCount}
                  />
                ) : null
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable> */}

        {/* test avec date  */}
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tasks_list"
              style={{ minHeight: "100vh" }}
            >
              {Object.entries(commandesGroupedByDate).map(([date, commandesForDate], dateIndex) => (
              <div key={dateIndex} className="groupByDate">
              <h4 className="dateGroup">{date}</h4> 
                  {commandesForDate.map((commande, index) => (
                    <Task
                      key={commande.key}
                      commande={commande}
                      index={index}
                      updateOrderStatus={updateOrderStatus}
                      updateNewOrdersCount={updateNewOrdersCount}
                    />
                  ))}
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export default Colums;
