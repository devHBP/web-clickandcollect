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

  return (
    <div className="flex-container">
      <div id={id} className="column">
        <h3>{title}</h3>
        <div style={{width:"250px", textAlign:'center'}}>
        <Select
          options={storeOptions}
          onChange={handleStoreChange}
          value={selectedStore}
          placeholder="Filtrer par magasin"
          isClearable
        />
        </div>
        

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
        <Droppable droppableId={id}>
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
        </Droppable>
      </div>
    </div>
  );
}

export default Colums;
