import React, { useState, useEffect } from "react";
import axios from "axios";
import ModaleAdd from "./ModaleAdd";
import { Table, Modal, Input } from "antd";
import {
  AiOutlineRest,
  AiOutlineReload,
  AiOutlineStock,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { Clickandcollect } from "../../SVG/Clickandcollect";
import { Antigaspi } from "../../SVG/Antigaspi";
import { TextInput } from "./TextInput";
const { Search } = Input;
import { Add } from "../../SVG/Add.jsx";
import "../styles/styles.css";
import UpdateProductModal from "./UpdateProductModal";

const ProduitsPage = () => {
  const [elements, setElements] = useState([]);
  const [openModaleAdd, setOpenModaleAdd] = useState(false);
  // const baseUrl = 'http://127.0.0.1:8080';
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [categories, setCategorie] = useState([]);
  const [visibleIncreaseStock, setVisibleIncreaseStock] = useState(false);
  const [visibleDecreaseStock, setVisibleDecreaseStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  //const [stock, setStock] = useState('')
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [decreaseAmount, setDecreaseAmount] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const colorClickandCollectOff = "#636C77";
  const colorClickandCollectOn = "#E9520E";
  const [stockValue, setStockValue] = useState({});
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProductToUpdate, setSelectedProductToUpdate] = useState(null);

  // const categories = ['Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Boissons',
  //  'Desserts', 'Salades et Bowls', 'Boules et Pains spéciaux', 'Baguettes'];

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllProducts`);
        let products = response.data;
        //console.log(response.data)

        setElements(products);
      } catch (error) {
        console.error("Une erreur s'est produite, allproducts :", error);
      }
    };

    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllFamillyProducts`);
        //console.log(response.data)

        const nomFamilleProduit = response.data.famillesProduit.map(
          (famille) => famille.nom_famille_produit
        );
        // console.log(nomFamilleProduit);
        setCategorie(nomFamilleProduit);
      } catch (error) {
        console.error("Une erreur s'est produite, allproducts :", error);
      }
    };

    fetchCategories(); // Appel de la fonction fetchData lors du montage du composant
  }, []);

  const handleDelete = async (productId) => {
    try {
      //serveur nodeJS
      const response = await axios.delete(
        `${baseUrl}/deleteProduct/${productId}`
      );

      // Vérifiez le statut de la réponse
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      // Actualisez votre état ici pour refléter la suppression du produit
      const updatedProduits = elements.filter(
        (produit) => produit.productId !== productId
      );
      setElements(updatedProduits);
      console.log("produit supprimé");
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  const handleProductUpdate = async (productId, updatedData) => {
    // console.log(updatedData)
    try {
      const formData = new FormData();

      formData.append("libelle", updatedData.libelle);
      formData.append("categorie", updatedData.categorie);
      formData.append("prix_unitaire", updatedData.prix_unitaire);
      formData.append(
        "prix_remise_collaborateur",
        updatedData.prix_remise_collaborateur
      );
      formData.append("disponibilite", updatedData.disponibilite);
      formData.append("description", updatedData.description);
      formData.append("descriptionProduit", updatedData.descriptionProduit);
      formData.append("ingredients", updatedData.ingredients);
      formData.append("allergenes", updatedData.allergenes);
      formData.append(
        "reference_fournisseur",
        updatedData.referenceFournisseur
      );
      formData.append("offre", updatedData.offre);

      if (updatedData.image) {
        formData.append("image", updatedData.image);
      }
      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}, ${pair[1]}`);
      // }

      // if (image) {
      //     formData.append('image', image);
      // }

      const response = await axios.put(
        `${baseUrl}/updateProduct/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data.image) //ok
      const updatedImageUrl = response.data.image; // Assurez-vous que cela correspond au champ renvoyé par votre serveur

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const updatedElements = elements.map((element) => {
        if (element.productId === productId) {
          return { ...element, ...updatedData, image: updatedImageUrl }; 
        }
        return element;
      });

      setElements(updatedElements);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };
  const updateProduits = (newProduits) => {
    setElements(newProduits);
  };

  //ajout handleAddProduct
  const handleAddProduct = async (formData) => {
    try {
      await axios.post(`${baseUrl}/addProduct`, formData);
      const response = await axios.get(`${baseUrl}/getAllProducts`);
      const allProductsUpdated = response.data;
      console.log("allProductsUpdated", allProductsUpdated);
      updateProduits(allProductsUpdated);
      setOpenModaleAdd(false);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  // requete ajout stock
  const handleIncreaseStock = async (productId, increaseAmount) => {
    try {
      const response = await axios.put(
        `${baseUrl}/increaseStock/${productId}`,
        { increaseAmount }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const updatedElements = elements.map((element) => {
        if (element.productId === productId) {
          return { ...element, stock: element.stock + Number(increaseAmount) };
        }
        return element;
      });

      setElements(updatedElements);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  const handleDecreaseStock = async (productId, decreaseAmount) => {
    try {
      const response = await axios.put(
        `${baseUrl}/decreaseStock/${productId}`,
        { decreaseAmount }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const updatedElements = elements.map((element) => {
        if (element.productId === productId) {
          return { ...element, stock: element.stock - Number(decreaseAmount) };
        }
        return element;
      });

      setElements(updatedElements);
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  // requete toggle produit clickandcollect
  const handleToggleClickandCollect = async (productId) => {
    try {
      // Trouvez le produit actuel avec productId (en supposant que vous avez une liste de produits dans un état ou une variable)
      const product = elements.find((p) => p.productId === productId); // Remplacez `products` par le nom de votre état ou variable
      if (!product) {
        throw new Error("Product not found");
      }

      // basculer la valeur de clickandcollect
      const updatedClickAndCollectValue = !product.clickandcollect;

      const response = await axios.put(
        `${baseUrl}/updateStatusProduct/${productId}`,
        { clickandcollect: updatedClickAndCollectValue }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      // Mettre à jour votre état local pour refléter la nouvelle valeur de clickandcollect
      setElements((prevElements) => {
        return prevElements.map((p) => {
          if (p.productId === productId) {
            return { ...p, clickandcollect: updatedClickAndCollectValue };
          }
          return p;
        });
      });
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  //requete toggle antigaspi
  const handleToggleAntigaspi = async (productId) => {
    try {
      // Trouvez le produit actuel avec productId (en supposant que vous avez une liste de produits dans un état ou une variable)
      const product = elements.find((p) => p.productId === productId); // Remplacez `products` par le nom de votre état ou variable

      if (!product) {
        throw new Error("Product not found");
      }

      // basculer la valeur de clickandcollect
      const updatedAntigaspiValue = !product.antigaspi;

      const response = await axios.put(
        `${baseUrl}/updateStatusProduct/${productId}`,
        { antigaspi: updatedAntigaspiValue }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }


      // Mettre à jour votre état local pour refléter la nouvelle valeur de clickandcollect
      setElements((prevElements) => {
        return prevElements.map((p) => {
          if (p.productId === productId) {
            return { ...p, antigaspi: updatedAntigaspiValue };
          }
          return p;
        });
      });
    } catch (error) {
      console.error("There has been a problem with your Axios request:", error);
    }
  };

  const Delete = (record) => {
    // console.log(record.id_produit)
    Modal.confirm({
      title: `Etes vous sur de supprimer ce produit : ${record.libelle} ?`,
      onOk: () => {
        handleDelete(record.productId);
      },
    });
  };

  const Update = (record) => {
    //  console.log('produciId page produit',record.productId)
    setSelectedProductToUpdate(record);
    setUpdateModalVisible(true);
  };
  const IncreaseStock = (record) => {
    // console.log(record.stock)
    setVisibleIncreaseStock(true);
    setSelectedProductId(record.productId);
    setSelectedProduct(record);
  };

  const DecreaseStock = (record) => {
    console.log(record.stock);
    setVisibleDecreaseStock(true);
    setSelectedProductId(record.productId);
    setSelectedProduct(record);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={`${baseUrl}/${image}`} alt="Produit" width="50" />
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      //sorter: (a, b) => a.stock- b.stock,
    },
    {
      title: "Libellé",
      dataIndex: "libelle",
      key: "libelle",
      sorter: (a, b) => a.libelle.localeCompare(b.libelle),
    },
    {
      title: "Catégorie",
      dataIndex: "categorie",
      key: "categorie",
      sorter: (a, b) => a.categorie.localeCompare(b.categorie),
    },
    {
      title: "Prix",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
      sorter: (a, b) => a.prix_unitaire - b.prix_unitaire,
    },
    // {
    //   title: 'Prix Collab',
    //   dataIndex: 'prix_remise_collaborateur',
    //   key: 'prix_remise_collaborateur',
    //   // sorter: (a, b) => a.prix_remise_collaborateur- b.prix_remise_collaborateur,
    // },
    {
      title: "Stock Anti-Gaspi",
      align: "center",

      render: (record) => {
        const handleInputChange = (e, productId) => {
          // Just update the local state
          const updatedValue = e.target.value;

          setStockValue((prevStock) => ({
            ...prevStock,
            [productId]: updatedValue,
          }));
        };

        const handleSave = async (productId) => {
          const updatedValue = stockValue[productId];
          if (updatedValue && updatedValue !== record.stockantigaspi) {
            try {
              const response = await axios.put(
                `${baseUrl}/updateStatusProduct/${productId}`,
                { stockantigaspi: updatedValue }
              );

              if (response.status !== 200) {
                throw new Error("Network response was not ok");
              }

              setElements((prevElements) => {
                return prevElements.map((p) => {
                  if (p.productId === productId) {
                    return { ...p, stockantigaspi: updatedValue };
                  }
                  return p;
                });
              });
            } catch (error) {
              console.error(
                "There has been a problem with your Axios request:",
                error
              );
            }
          }
        };

        return (
          <div>
            <TextInput
              value={
                stockValue[record.productId] !== undefined
                  ? stockValue[record.productId]
                  : record.stockantigaspi !== null
                  ? record.stockantigaspi
                  : ""
              }
              onChange={(e) => handleInputChange(e, record.productId)}
              onBlur={() => handleSave(record.productId)}
              // onClick={() => console.log('stock', record.stockantigaspi)}
            />
          </div>
        );
      },
    },
    {
      title: "C&Collect",
      align: "center",

      render: (record) => {
        const handleSvgClick = async () => {
          await handleToggleClickandCollect(record.productId);
        };

        const color = record.clickandcollect
          ? colorClickandCollectOn
          : colorClickandCollectOff;

        return <Clickandcollect color={color} onSvgClick={handleSvgClick} />;
      },
    },
    {
      title: "Antigaspi",
      align: "center",

      render: (record) => {
        const handleSvgClick = async () => {
          await handleToggleAntigaspi(record.productId);
        };

        const color = record.antigaspi
          ? colorClickandCollectOn
          : colorClickandCollectOff;

        return <Antigaspi color={color} onSvgClick={handleSvgClick} />;
      },
    },

    {
      key: "action",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <AiOutlinePlusCircle onClick={() => IncreaseStock(record)} />

            <Modal
              title="Modification du stock"
              open={visibleIncreaseStock}
              onCancel={() => setVisibleIncreaseStock(false)}
              onOk={() => {
                handleIncreaseStock(selectedProductId, increaseAmount);
                setVisibleIncreaseStock(false);
              }}
              okText="Save"
              maskStyle={{ backgroundColor: "lightgray" }}
            >
              <p>Produit: {selectedProduct?.libelle}</p>
              <div style={{ display: "flex", gap: "20px" }}>
                <div className="inputOptions">
                  <label htmlFor="stock">Ajouter Stock:</label>
                  <input
                    type="text"
                    id="stock"
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(e.target.value)}
                    style={{ width: "30px" }}
                  />
                </div>
              </div>
            </Modal>

            <AiOutlineMinusCircle onClick={() => DecreaseStock(record)} />

            <Modal
              title="Modification du stock"
              open={visibleDecreaseStock}
              onCancel={() => setVisibleDecreaseStock(false)}
              onOk={() => {
                handleDecreaseStock(selectedProductId, decreaseAmount);
                setVisibleDecreaseStock(false);
              }}
              okText="Save"
              maskStyle={{ backgroundColor: "lightgray" }}
            >
              <p>Produit: {selectedProduct?.libelle}</p>
              <div style={{ display: "flex", gap: "20px" }}>
                <div className="inputOptions">
                  <label htmlFor="stock">Diminuer Stock:</label>
                  <input
                    type="text"
                    id="stock"
                    value={decreaseAmount}
                    onChange={(e) => setDecreaseAmount(e.target.value)}
                    style={{ width: "30px" }}
                  />
                </div>
              </div>
            </Modal>

            <AiOutlineReload onClick={() => Update(record)} />

            <UpdateProductModal
              visible={updateModalVisible}
              setVisible={setUpdateModalVisible}
              product={selectedProductToUpdate}
              categories={categories}
              onUpdateProduct={handleProductUpdate}
            />
            <AiOutlineRest onClick={() => Delete(record)} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="page_produits_container">
        {/* <h3>Les produits</h3> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <button onClick={() => setOpenModaleAdd(true)} className="button_add">
            <Add />
            Ajouter un produit
          </button>

          <Search
            placeholder="Rechercher un produit"
            size="medium"
            style={{ width: 200 }}
            onChange={handleSearch}
          />
        </div>

        <div className="Tableau">
          <Table
            dataSource={elements.filter((product) =>
              product.libelle.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            columns={columns}
            pagination={{ position: ["bottomCenter"], pageSize: 5 }}
            rowKey="productId"
          />
        </div>
      </div>

      {openModaleAdd && (
        <ModaleAdd
          setOpenModaleAdd={setOpenModaleAdd}
          handleAddProduct={handleAddProduct}
        />
      )}
    </>
  );
};

export default ProduitsPage;
