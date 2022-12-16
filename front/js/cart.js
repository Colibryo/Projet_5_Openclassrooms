fetch("http://localhost:3000/api/products")
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Erreur serveur');

  })

  .then(ProductsJson => {

    function getBasket() {
      let tableBasket = localStorage.getItem('basket');
      return JSON.parse(tableBasket);

    }

    let basket = getBasket()
    let i = 0
    let newTableBasket = []
    while (i < basket.length) {
      let articleBasket = basket[i]
      let articleJson = ProductsJson.find(items => { return items._id === articleBasket._id })
      let newProductBasket = Object.assign(articleBasket, articleJson)
      newProductBasket.price *= newProductBasket.quantity;
      newTableBasket.push(newProductBasket)
      ++i
    }

      for (let product of newTableBasket) {
        
        document.querySelector('#cart__items').innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                                                              <div class="cart__item__img">
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                              </div>
                                                              <div class="cart__item__content">
                                                                <div class="cart__item__content__description">
                                                                  <h2>${product.name}</h2>
                                                                  <p>${product.color}</p>
                                                                  <p>${product.price} €</p>
                                                                </div>
                                                                <div class="cart__item__content__settings">
                                                                  <div class="cart__item__content__settings__quantity">
                                                                    <p>Qté : </p>
                                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                                                  </div>
                                                                  <div class="cart__item__content__settings__delete">
                                                                    <p class="deleteItem">Supprimer</p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </article> `

      }
     
       //fonction permettant de réduire le panier aux quantités de chaque produit et d'en faire le total
        let initialTotalQuantityValue = 0
        let totalQuantityProducts = newTableBasket.reduce(
          (accumulator, currentValue) => accumulator + currentValue.quantity, initialTotalQuantityValue);
        document.getElementById('totalQuantity').innerHTML += totalQuantityProducts
        
      //fonction permettant de réduire le panier pour récupérer le prix total de chaque produit et d'en faire le total
      let initialTotalPriceValue = 0
      let totalPriceProducts = newTableBasket.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price, initialTotalPriceValue);
      document.getElementById('totalPrice').innerHTML += totalPriceProducts
      
    function saveBasket(tableBasket) {
      localStorage.setItem('basket', JSON.stringify(tableBasket));
    }

    //bouton pour supprimer un produit
    let deleteButtons = document.querySelectorAll('article .deleteItem');
    for (let deleteButton of deleteButtons)
    deleteButton.addEventListener('click', deleteProduct)
      
      function deleteProduct() {
        let cartProduct = this.closest('.cart__item');
        let basket = getBasket();
        console.log(basket)
        let newBasket = basket.filter(element => element._id !== cartProduct.dataset.id || element.color !== cartProduct.dataset.color);
          console.log(newBasket)
        //substitue le produit par l'index afin de conserver l'ordre des commandes
        saveBasket(newBasket);
        cartProduct.remove();
        
      }

      //bouton pour changer la quantité d'un produit
    let selectElements = document.querySelectorAll('article input');
    for (let inputQuantity of selectElements)
    inputQuantity.addEventListener('change', upDateValue)

    function upDateValue() {
       
      let cartProduct = this.closest('.cart__item');
      let inputValue = parseInt(this.closest('.itemQuantity').value);
       let doc = this.closest('.itemQuantity');
      console.log(doc)
     if (inputValue == 0 || inputValue == undefined) {
        alert("Merci d'indiquer un nombre d'article(s) entre 1 et 100");
      }

      if (inputValue > 100) {
        alert("Merci d'indiquer un nombre d'articles inférieur à 100");
      }

      else {
       // modification du panier
        let newProduct = {
         _id: cartProduct.dataset.id,
         color: cartProduct.dataset.color,
        quantity: inputValue
        }
        let basket = getBasket();
        let searchProduct = basket.find(element => element._id === newProduct._id && element.color === newProduct.color);
        //substitue le produit par l'index afin de conserver l'ordre des commandes
        let indexProduct = basket.indexOf(searchProduct)
        basket.splice(indexProduct, 1, newProduct)
        saveBasket(basket);
       
      }
    }

  }) 