<>
<p>
    {item.qty} x {""}
    {item.libelle}
    </p>
    <Select
      id={`product-select-${index}`}
      defaultValue="Choisissez un produit"
      onChange={(value) => handleSelectChange(value, index)}
      style={{ width: 200 }}
    >
      {/* <Select.Option value="">Choisissez un produit</Select.Option> */}
      {products.map((product, pIndex) => (
        <Select.Option
          key={`product-option-${product.productId}-${pIndex}`}
          value={product.productId}
        >
          {product.libelle}
        </Select.Option>
      ))}
    </Select>
    <Select
      defaultValue={selectedQuantities[index]}
      style={{ width: 60, marginLeft: 8 }}
      onChange={(value) => handleQuantityChange(value, index)}
    >
      {Array.from({ length: item.qty }, (_, i) => (
        <Select.Option key={i + 1} value={i + 1}>
          {i + 1}
        </Select.Option>
      ))}
    </Select>
 
  
  </>



if ( cart[index].type === "formule") {
    const optionKey = productIdToUpdate.optionKey;

    // cart[index] = {
    //   ...cart[index],
    //   option1: { ...cart[index].option1, newProductId: response.data.productId, newLibelle: response.data.libelle, },
    //   option2: { ...cart[index].option2, newProductId: response.data.productId, newLibelle: response.data.libelle, },
    //   option3: { ...cart[index].option3, newProductId: response.data.productId, newLibelle: response.data.libelle, },
    // };

    cart[index][optionKey] = {
      ...cart[index][optionKey],
      newProductId: response.data.productId,
      newLibelle: response.data.libelle,
    };
  }
  else {
    cart[index] = {
      ...cart[index],
      newProductId: response.data.productId,
      newLibelle: response.data.libelle,
      newPrix_unitaire: response.data.prix_unitaire,
      newQty: selectedQuantities[index],
    };
  }


    //modification de la commande
  const handleSubmit = async () => {
    let isUpdated = false;

    for (let index = 0; index < selectedProducts.length; index++) {
      const productInfo = selectedProducts[index];
  
      try {
        // Vérifiez si le produit est une formule ou non.
        if (cart[index].type === "formule") {
          // Itérer sur chaque option de la formule.
          for (let optionKey of ["option1", "option2", "option3"]) {
            const option = productInfo[optionKey];
            if (option && option.selected) {
              const response = await axios.get(
                `${baseUrl}/getOneProductForNewCartString/${option.productId}`
              );
              cart[index][optionKey] = {
                ...option,
                newProductId: response.data.productId,
                newLibelle: response.data.libelle,
              };
            }
          }
        } else {
          if (productInfo.selected) {
            const response = await axios.get(
              `${baseUrl}/getOneProductForNewCartString/${productInfo.productId}`
            );
            console.log('response 2', response.data)

            cart[index] = {
              ...cart[index],
              newProductId: response.data.productId,
              newLibelle: response.data.libelle,
              newPrix_unitaire: response.data.prix_unitaire,
              newQty: selectedQuantities[index],
            };

          }
        }
        isUpdated = true;
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
        toast.error("Une erreur s'est produite lors de la mise à jour du produit.");
        isUpdated = false;
        break; 
      }
    }

    if (isUpdated) {
      try {
        const updatePayload = {
          orderId: order.key,
          cartString: JSON.stringify(cart),
        };

        // Envoyez la requête de mise à jour
        await axios.put(`${baseUrl}/updateOrderContent/`, updatePayload);

        // Mise à jour réussie, fermez la modale et mettez à jour les données de commande
        setOpenModaleUpdateOrder(false);
        updateCommandeData();

        // toast.success("Commande mise à jour avec succès");
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la mise à jour de la commande :",
          error
        );
        toast.error("Échec de la mise à jour de la commande");
      }
    } else {
      toast.error("Pas de modifications apportées");
      setOpenModaleUpdateOrder(false);
    }
  };

   // const handleSelectChange = (value, index) => {
  //   // il faut ici faire 2 cas (si formule ou pas)
  //   const updatedSelectedProducts = [...selectedProducts];
  //   updatedSelectedProducts[index] = value;
  //   setSelectedProducts(updatedSelectedProducts);
  // };
  // const handleSelectChange = (value, index, optionKey = null) => {
  //   console.log("handleSelectChange called", { value, index, optionKey });
  
  //   setSelectedProducts((prevSelectedProducts) => {
  //     console.log("Before updating", prevSelectedProducts);
  //     console.log("Updating index", index, "with value", value, "for optionKey", optionKey);
  
  //     const updatedSelectedProducts = prevSelectedProducts.map((productInfo, i) => {
  //       if (i === index) {
  //         if (optionKey && productInfo[optionKey]) {
  //           return {
  //             ...productInfo,
  //             [optionKey]: { productId: value, selected: true },
  //           };
  //         } else {
  //           return { ...productInfo, productId: value, selected: true };
  //         }
  //       }
  //       return productInfo;
  //     });
  
  //     // Ici, vous pouvez aussi ajouter un console.log pour voir l'état après la mise à jour
  //     console.log("After updating", updatedSelectedProducts);
  
  //     return updatedSelectedProducts;
  //   });
  // };

  //usestate
    // const [selectedProducts, setSelectedProducts] = useState(
  //   order.cartString.map(() => "")
  // );
  // const [selectedProducts, setSelectedProducts] = useState(
  //   order.cartString.map((item) => {
  //     if (item.type === "formule") {
  //       return {
  //         option1: {
  //           productId: item.option1?.productId || null,
  //           selected: false,
  //         },
  //         option2: {
  //           productId: item.option2?.productId || null,
  //           selected: false,
  //         },
  //         option3: {
  //           productId: item.option3?.productId || null,
  //           selected: false,
  //         },
  //       };
  //     }
  //     return { productId: item.productId, selected: false };
  //   })
  // );