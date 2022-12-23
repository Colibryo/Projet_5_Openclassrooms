//fonction pour récupération du panier
function getBasket() {
  let tableBasket = localStorage.getItem('basket');
  return JSON.parse(tableBasket);
}

//fonction pour sauvegarder le panier (pris en paramètre) dans le localstorage
function saveBasket(tableBasket) {
  localStorage.setItem('basket', JSON.stringify(tableBasket));
}

//fontction pour le calcul du prix total de chaque  produits pris respectivement en paramètres
function priceMergeProducts(price, quantity) {
  return price *= quantity
}
//fonction pour fusionner la data et le panier du localStorage pris respectivement en paramètres  
function mergeProducts(data, products) {
  return Object.assign(data, products)
}

//fonction permettant de calculer le total des prix totaux des produits récupérés dans un tableau
let sumPrice = 0
function totalPrice(tablePrice) {
  let initialValue = 0;
  sumPrice = tablePrice.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue);
}

//fonction pour afficher toutes les données des produits fusionnés pris en paramètres 
let totalPriceProduct = 0;
let tablePrice = [];
function displayDataBasket(mergeProduct) {

  totalPriceProduct = priceMergeProducts(mergeProduct.price, mergeProduct.quantity);

  let section = document.querySelector('#cart__items');
  let article = document.createElement('article');
  article.setAttribute('data-id', `${mergeProduct._id}`);
  article.setAttribute('data-color', `${mergeProduct.color}`);
  article.className = 'cart__item';
  section.appendChild(article);

  let divImg = document.createElement('div');
  divImg.className = 'cart__item__img';
  article.appendChild(divImg);

  let image = document.createElement('img');
  image.setAttribute("src", `${mergeProduct.imageUrl}`);
  image.setAttribute("alt", `${mergeProduct.altTxt}`);
  divImg.appendChild(image);

  let divContent = document.createElement('div');
  divContent.className = 'cart__item__content';
  article.appendChild(divContent);

  let divDescription = document.createElement('div');
  divDescription.className = 'cart__item__content__description';
  divContent.appendChild(divDescription);

  let title = document.createElement('h2');
  title.textContent = `${mergeProduct.name}`;
  divDescription.appendChild(title);

  let color = document.createElement('p');
  color.textContent = `${mergeProduct.color}`;
  divDescription.appendChild(color);

  let price = document.createElement('p');
  price.textContent = `${totalPriceProduct}` + ',00 €';
  divDescription.appendChild(price);

  let divSettings = document.createElement('div');
  divSettings.className = 'cart__item__content__settings';
  divContent.appendChild(divSettings);

  let divSettingsQuantity = document.createElement('div');
  divSettingsQuantity.className = 'cart__item__content__settings__quantity';
  divSettings.appendChild(divSettingsQuantity);

  let quantity = document.createElement('p');
  quantity.textContent = 'Qté : ';
  divSettingsQuantity.appendChild(quantity);

  let inputQuantity = document.createElement('input');
  inputQuantity.setAttribute('type', 'number');
  inputQuantity.className = 'itemQuantity';
  inputQuantity.setAttribute('name', 'itemQuantity');
  inputQuantity.setAttribute('min', '1');
  inputQuantity.setAttribute('max', '100');
  inputQuantity.setAttribute('value', `${mergeProduct.quantity}`);
  divSettingsQuantity.appendChild(inputQuantity);

  let divSettingsDelete = document.createElement('div');
  divSettingsDelete.className = 'cart__item__content__settings__delete'
  divSettings.appendChild(divSettingsDelete);

  let deleteButton = document.createElement('p');
  deleteButton.className = 'deleteItem';
  deleteButton.textContent = "Supprimer";
  divSettingsDelete.appendChild(deleteButton);

  //Affichage du prix total de la commande
  tablePrice.push(totalPriceProduct);
  totalPrice(tablePrice);
  document.getElementById('totalPrice').textContent = sumPrice;

}

//fonction pour calculer la quantité totale de tous les produits 
function totalQuantity(tableQuantity) {
  let initialTotalQuantityValue = 0;
  let totalQuantityProducts = tableQuantity.reduce(
    (accumulator, currentValue) => accumulator + currentValue.quantity, initialTotalQuantityValue);
  document.getElementById('totalQuantity').textContent = totalQuantityProducts
}

//fonction pemettant de recalculer le prix total de tous les produits 
function replaceTotalPrice() {
  let tableRestPrice = [];
  let allPrice = document.querySelectorAll('.cart__item__content__description p:last-child');

  for (let i = 0; i < allPrice.length; i++) {
    let price = allPrice[i].textContent;
    let intigerPrice = parseInt(price);
    tableRestPrice.push(intigerPrice);
  }

  totalPrice(tableRestPrice);
  document.getElementById('totalPrice').textContent = sumPrice;
}

// fonction du bouton pour supprimer les produits dans le panier et dans le DOM
function deleteProduct() {
  let cartProduct = this.closest('.cart__item');
  let basket = getBasket();
  let newBasket = basket.filter(element => element._id !== cartProduct.dataset.id || element.color !== cartProduct.dataset.color);
  saveBasket(newBasket);
  cartProduct.remove();
  //modification de la quantité totale du panier dans le DOM
  totalQuantity(newBasket);
  replaceTotalPrice();

}

//fonction du bouton pour changer la quantité et le prix total d'un produit
function upDateValues() {

  let inputValue = parseInt(this.closest('.itemQuantity').value);
  if (inputValue <= 0 || inputValue > 100 || isNaN(inputValue)) {
    alert("Merci d'indiquer un nombre d'article(s) entre 1 et 100");
    const cartProduct = this.closest('.cart__item');
    let productElements = {
      _id: cartProduct.dataset.id,
      color: cartProduct.dataset.color,
    }
    let basket = getBasket();
    let productBasket = basket.find(element => element._id === productElements._id && element.color === productElements.color);
    this.closest('.itemQuantity').value = productBasket.quantity;
  }


  else {
    let cartProduct = this.closest('.cart__item');
    // modification du panier
    let newProduct = {
      _id: cartProduct.dataset.id,
      color: cartProduct.dataset.color,
      quantity: inputValue
    }
    let basket = getBasket();
    let searchProduct = basket.find(element => element._id === newProduct._id && element.color === newProduct.color);
    //substitue le produit par l'index afin de conserver l'ordre des commandes
    let indexProduct = basket.indexOf(searchProduct);
    basket.splice(indexProduct, 1, newProduct);
    saveBasket(basket);
    //modification du prix total dans le DOM
    let productTab = tableMergeProduct.find(element => element._id === newProduct._id && element.color === newProduct.color)
    let newTotalPrice = productTab.price * inputValue;
    let price = cartProduct.querySelector('.cart__item__content__description p:last-child');
    price.textContent = `${newTotalPrice}` + ',00 €';
    //modification de la quantité totale du panier dans le DOM
    totalQuantity(basket);
    replaceTotalPrice();

  }
}

/* *récupération des produits correspondant au localStorage dans le serveur 
*Affichage  tous les produits et leurs éléments
 * affichage de la quantité total des produits
 * */

let newTableBasket = getBasket()
let tableMergeProduct = []
for (let products of newTableBasket) {

  fetch(`http://localhost:3000/api/products/${products._id}`)
    .then((response) => response.json())
    .then((data) => {

      let mergeProduct = mergeProducts(data, products);
      tableMergeProduct.push(mergeProduct);

      displayDataBasket(mergeProduct);

      totalQuantity(tableMergeProduct);

      //bouton pour supprimer les produits du panier
      let deleteButtons = document.querySelectorAll('article .deleteItem');
      for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', deleteProduct)
      }

      //Changement des prix des produits avec le sélecteur
      let selectElements = document.querySelectorAll('article input');
      for (let inputQuantity of selectElements) {
        inputQuantity.addEventListener('change', upDateValues)
      }

    })

}

let formOrder = document.querySelector('.cart__order__form');

//vérification de la validité de la saisie du prénom dans le formulaire 
formOrder.firstName.addEventListener('change', checkValidityFirstName);
let firstnameInput = 0
//Fonction pour vérifier la validité du champs "prénom" du formulaire
function checkValidityFirstName() {
  let dataInputFirstName = formOrder.firstName.value;
  let regExpfirstName = /^[A-Z][a-z-àâäéèêëïîôöùûüÿç'.\s]{1,110}$/g;
  let firstNameMsg = document.querySelector('#firstNameErrorMsg');

  if (regExpfirstName.test(dataInputFirstName)) {
    firstNameMsg.textContent = 'Prénom valide';
    firstnameInput = true;
  }
  else {
    firstNameMsg.textContent = 'Prénom invalide';
    firstnameInput = false;
  }

}

//vérification de la validité de la saisie du nom dans le formulaire
formOrder.lastName.addEventListener('change', checkValidityName)
let nameInput = 0
//Fonction pour vérifier la validité du champs "nom" du formulaire
function checkValidityName() {
  let dataInputName = formOrder.lastName.value;
  let regExpName = /^[A-Z'.\s]{1,110}$/g;
  let nameMsg = document.querySelector('#lastNameErrorMsg')

  if (regExpName.test(dataInputName)) {
    nameMsg.textContent = 'Nom valide'
    nameInput = true
  }
  else {
    nameMsg.textContent = 'Nom invalide';
    nameInput = false
  }
}

//vérification de la validité de la saisie de l'adresse dans le formulaire
formOrder.address.addEventListener('change', checkValidityAddress)
let addressInput = 0;
//Fonction pour vérifier la validité du champs "adresse" du formulaire
function checkValidityAddress() {
  let dataInputAddress = formOrder.address.value;
  let regExpAddress = /^[a-zA-Z0-9àâäéèêëïîôöùûüÿç\s,'-]{1,100}$/g
  let addressMsg = document.querySelector('#addressErrorMsg')

  if (regExpAddress.test(dataInputAddress)) {
    addressMsg.textContent = 'Adresse valide';
    addressInput = true;
  }
  else {
    addressMsg.textContent = 'Adresse non valide';
    addressInput = false;
  }
}

//vérification de la validité de la saisie des informations sur la ville dans le formulaire
formOrder.city.addEventListener('change', checkValidityCity)
let cityInput = 0
//Fonction pour vérifier la validité du champs "ville" du formulaire et afficher un message en cas d'erreur
function checkValidityCity() {
  let dataInputCity = formOrder.city.value;
  let regExpCity = /^[A-Z0-9,\s'-]{2,55}$/g
  let cityMsg = document.querySelector('#cityErrorMsg')

  if (regExpCity.test(dataInputCity)) {
    cityMsg.textContent = 'Nom de ville valide';
    cityInput = true;
  }
  else {
    cityMsg.textContent = 'Nom de ville invalide';
    cityInput = false;
  }
}

//vérification de la validité de la saisie de l'email dans le formulaire
formOrder.email.addEventListener('change', checkValidityEmail)
//Fonction pour vérifier la validité du champs "email" du formulaire et afficher un message en cas d'erreur
let emailInput = 0;
function checkValidityEmail() {
  let regExpEmail = /^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-_]+[.][a-z]{2,10}$/g
  let dataInputEmail = formOrder.email.value;
  let emailMsg = document.querySelector('#emailErrorMsg')

  if (regExpEmail.test(dataInputEmail)) {
    emailMsg.textContent = 'Adresse email valide';
    emailInput = true;
  }
  else {
    emailMsg.textContent = 'Adresse email invalide';
    emailInput = false;
  }
}

//vérification de la validité de tous les champs du formulaire au moment de cliquer sur le bouton commander
document.querySelector('#order').addEventListener('click', (e) => {
  if (firstnameInput === true && nameInput === true && addressInput === true && cityInput === true && emailInput === true) {
    console.log(checkInputs)
   
  }
  else{
    e.preventDefault();
  }
})