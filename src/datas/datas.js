export const initialData = {
    tasks: {
      "task-1": {
        id: "task-1",
        content: {
          numero_commande: "#1",
          client: "1",
          prix_total: "12"
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
              prix_unitaire: 1.5
            }
          ],
          date: "06-06-2023",
          status: "attente",
          magasin:'Mas Guerio', 
          delivery:false,
        }
      },
      "task-2": {
        id: "task-2",
        content: {
          numero_commande: "#2",
          client: "2",
          prix_total: "12"
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
            }
          ],
          date: "06-06-2023",
          status: "attente",
          magasin:'Mas Guerio',
          delivery:false,
        }
      },
      "task-3": {
        id: "task-3",
        content: {
          numero_commande: "#3",
          client: "3",
          prix_total: "12"
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
            }
          ],
          date: "06-06-2023",
          status: "attente",
          magasin:'Mas Guerio',
          delivery:false,
        }
      }
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "Commandes en attente",
        taskIds: ["task-1", "task-2", "task-3"]
      },
      "column-2": {
        id: "column-2",
        title: "Commandes en préparation",
        taskIds: []
      },
      "column-3": {
        id: "column-3",
        title: "Commandes prêtes à récupérer",
        taskIds: []
      }
    },
    columnOrder: ["column-1", "column-2", "column-3"]
  };
