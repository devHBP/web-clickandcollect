import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { Select, Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_API_URL;

const ModaleUpdateOrder = ({
  setOpenModaleUpdateOrder,
  order,
  updateCommandeData,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState(
    order.cartString.map((item) => item.qty)
  );

  // test
  const [selectedProducts, setSelectedProducts] = useState(
    order.cartString.map((item) => {
      if (item.type === "formule") {
        // Générer un objet pour chaque option avec les informations originales
        const options = {};
        ["option1", "option2", "option3"].forEach((optionKey) => {
          options[optionKey] = {
            original: {
              productId: item[optionKey]?.productId || null,
              libelle: item[optionKey]?.libelle || "",
            },
            selected: false,
            newProduct: {
              productId: null,
              libelle: "",
            },
          };
        });
        return options;
      }

      return {
        original: {
          productId: item.productId,
          libelle: item.libelle,
        },
        selected: false,
        newProduct: {
          productId: null,
          libelle: "",
        },
      };
    })
  );

  const cart = order.cartString;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const getAllProductsClickandCollect = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/getAllProductsClickandCollect`
        );
        const organizeProductsByCategory = (products) => {
          return products.reduce((acc, product) => {
            const { categorie, ...rest } = product;
            acc[categorie] = acc[categorie] || [];
            acc[categorie].push(rest);
            return acc;
          }, {});
        };
      
        const categorizedProducts = organizeProductsByCategory(response.data);
        setProducts(categorizedProducts);
        // setProducts(response.data);
      } catch (error) {
        console.error("Une erreur s'est produite, error products :", error);
      }
    };
  
    getAllProductsClickandCollect();
  }, [selectedProduct]);

  const handleSelectChange = (value, index, optionKey = null) => {
    setSelectedProducts((prevSelectedProducts) => {
      return prevSelectedProducts.map((productInfo, i) => {
        if (i === index) {
          // Trouvez d'abord la catégorie du produit sélectionné
          let newProductInfo;
          for (const category in products) {
            newProductInfo = products[category].find(
              (product) => product.productId === value
            );
            if (newProductInfo) break;
          }
  
          // Vérifiez que le nouveau produit a été trouvé
          if (!newProductInfo) {
            console.error('Produit sélectionné non trouvé dans les catégories');
            return productInfo; 
          }
  
          // Si on travaille avec une formule et une option spécifique
          if (optionKey && productInfo[optionKey]) {
            return {
              ...productInfo,
              [optionKey]: {
                ...productInfo[optionKey],
                selected: true,
                newProduct: {
                  productId: newProductInfo.productId,
                  libelle: newProductInfo.libelle,
                },
              },
            };
          } else if (!optionKey) {
            // Si on travaille avec un produit simple
            return {
              ...productInfo,
              selected: true,
              newProduct: {
                productId: newProductInfo.productId,
                libelle: newProductInfo.libelle,
              },
            };
          }
        }
        return productInfo;
      });
    });
  };

  const handleQuantityChange = (value, index) => {
    const newQuantities = [...selectedQuantities];
    newQuantities[index] = value;
    setSelectedQuantities(newQuantities);
  };

  const handleSubmit = async () => {
    let isUpdated = false;

    // console.log('cart', cart);
    // console.log('selectedProducts', selectedProducts);

    cart.forEach((item, index) => {
      const productInfo = selectedProducts[index];
      // console.log(`Item ${index}:`, item, productInfo);
    });

    const promises = cart.map((item, index) => {
      const productInfo = selectedProducts[index];

      // console.log('productInfo', productInfo)
      if (item.type === "formule") {
        //console.log("modif sur une formule");
        return Promise.all(
          ["option1", "option2", "option3"].map(async (optionKey) => {
            const option = productInfo[optionKey];
            if (option && option.selected && option.newProduct.productId) {
              try {
                const response = await axios.get(
                  `${baseUrl}/getOneProductForNewCartString/${option.newProduct.productId}`
                );
                item[optionKey].newProductId = response.data.productId;
                item[optionKey].newLibelle = response.data.libelle;
                isUpdated = true;
              } catch (error) {
                console.error(
                  `Erreur lors de la mise à jour de ${optionKey}:`,
                  error
                );
              }
            }
          })
        );
      } else if (productInfo.selected && productInfo.newProduct.productId) {
        //console.log("modif sur un produit");
        return axios
          .get(
            `${baseUrl}/getOneProductForNewCartString/${productInfo.newProduct.productId}`
          )
          .then((response) => {
            item.newProductId = response.data.productId;
            item.newLibelle = response.data.libelle;
            isUpdated = true;
          })
          .catch((error) => {
            console.error(`Erreur lors de la mise à jour du produit:`, error);
          });
      }
      return Promise.resolve();
    });

    // Attendre la résolution de toutes les promesses
    await Promise.all(promises);

    if (isUpdated) {
      try {
        const updatePayload = {
          orderId: order.key,
          cartString: JSON.stringify(cart),
        };

        await axios.put(`${baseUrl}/updateOrderContent/`, updatePayload);
        setOpenModaleUpdateOrder(false);
        toast.success("Commande mise à jour avec succès", {
          duration: 3000,
        });

        await delay(3000);
        updateCommandeData();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande :", error);
        toast.error("Échec de la mise à jour de la commande");
      }
    } else {
      toast.error("Pas de modifications apportées");
      setOpenModaleUpdateOrder(false);
    }
  };

  const renderProductOptions = () => {
    return Object.keys(products).map((category) => (
      <Select.OptGroup key={category} label={category} >
        {products[category].map((product) => (
          <Select.Option key={product.productId} value={product.productId}>
            {product.libelle}
          </Select.Option>
        ))}
      </Select.OptGroup>
    ));
  };

  return (
    <div className="modale_container">
      <div className="modale">
        <div className="contentTitleModale">
          <p className="title_modale">
            Commande n° {order.key} pour {order.client}{" "}
          </p>
          <AiFillCloseCircle
            className="button_close"
            onClick={() => setOpenModaleUpdateOrder(false)}
          />
        </div>
        {cart.map((item, index) => {
          return (
            <div key={`item-${index}`} className="contentLiOrder">
              {/* si c'est une formule - je liste sur les options */}
              {item.type === "formule" ? (
                <>
                  <p style={{ fontWeight: "bold" }}>
                    {item.qty} x {item.libelle}
                  </p>
                  {["option1", "option2", "option3"].map((optionKey) => {
                    const option = item[optionKey];
                    return (
                      option && (
                        <div key={optionKey} className="selectFormule">
                          <p>
                            {option.newLibelle ? (
                              <span>
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  {option.libelle}
                                </span>{" "}
                                <span>{option.newLibelle}</span>
                              </span>
                            ) : (
                              option.libelle
                            )}
                          </p>
                          <div>
                            <Select
                              id={`product-select-${option.productId}`}
                              defaultValue="Choisissez un produit"
                              onChange={(value) =>
                                handleSelectChange(value, index, optionKey)
                              }
                              style={{ width: 200 }}
                            >
                              {renderProductOptions(option, index)}
                            </Select>
                            <Select
                              defaultValue={selectedQuantities[index]}
                              style={{ width: 60, marginLeft: 8 }}
                              onChange={(value) =>
                                handleQuantityChange(value, index)
                              }
                            >
                              {Array.from({ length: 10 }, (_, i) => (
                                <Select.Option key={i} value={i + 1}>
                                  {i + 1}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      )
                    );
                  })}
                </>
              ) : (
                <>
                  <p style={{ fontWeight: "bold" }}>
                    <p>
                      {item.newLibelle ? (
                        <span>
                          <span style={{ textDecoration: "line-through" }}>
                            {item.libelle}
                          </span>{" "}
                          <span>{item.newLibelle}</span>
                        </span>
                      ) : (
                        item.libelle
                      )}
                    </p>
                    {/* {item.qty} x {item.libelle} */}
                  </p>
                  <div>
                    <Select
                      id={`product-select-${index}`}
                      defaultValue="Choisissez un produit"
                      onChange={(value) => handleSelectChange(value, index)}
                      style={{ width: 200 }}
                    >
                      {renderProductOptions(item, index)}
                    </Select>
                    <Select
                      defaultValue={selectedQuantities[index]}
                      style={{ width: 60, marginLeft: 8 }}
                      onChange={(value) => handleQuantityChange(value, index)}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <Select.Option key={i} value={i + 1}>
                          {i + 1}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div className="viewContent">
          <button className="button_delivery" onClick={() => handleSubmit()}>
            Remplacer
          </button>
          <button
            className="button_cancel"
            onClick={() => setOpenModaleUpdateOrder(false)}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModaleUpdateOrder;
