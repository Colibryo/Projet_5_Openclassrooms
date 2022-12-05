fetch("http://localhost:3000/api/products")
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Erreur serveur');

  })

  .then(ProductsJson => {

    let getBasket = localStorage.getItem('basket')

    let basket = JSON.parse(getBasket)

    let i = 0
    let newTabBasket = []

    while (i < basket.length) {
      let b = basket[i]
      let a = ProductsJson.find(items => { return items._id === b._id })
      let newProductBasket = Object.assign(b, a)
      newProductBasket.price *= newProductBasket.quantity;
      newTabBasket.push(newProductBasket)
      ++i
    }

    for (let product of newTabBasket) {
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

    const initialTotalQuantityValue = 0
    const totalQuantityProducts = newTabBasket.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity, initialTotalQuantityValue);
    document.getElementById('totalQuantity').innerHTML += totalQuantityProducts
    const initialTotalPriceValue = 0
    const totalPriceProducts = newTabBasket.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price, initialTotalPriceValue);
    document.getElementById('totalPrice').innerHTML += totalPriceProducts
  })