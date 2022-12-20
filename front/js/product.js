//recherche de l'url dans la page en cours - récupére l'id du produit avec la clé dans une variable
let params = new URLSearchParams(document.location.search);
let id = params.get("idProduct");

/*fonction pour ajouter les produits au localStorage
* prend en paramètre les données des produits
*intégre les produits avec leurs éléments dans le localStorage*/
function setBasket(tableBasket) {
       localStorage.setItem('basket', JSON.stringify(tableBasket));
}

/*fonction qui crée le panier dans le localStorage s'il n'existe pas 
 sinon récupère les données du panier */
function getBasket() {
       let tableBasket = localStorage.getItem('basket');

       if (tableBasket === null) {
              return [];
       }

       else {
              return JSON.parse(tableBasket);
       }
}

/**fonction pour ajouter le produit sélectionné sur la page dans le panier : 
* si le produit existe déjà, la quantité du produit existant est ajoutée à celle du produit sélectionné dans la page, 
Après filtrage du panier pour ne pas récupérer le précédent produit, le produit regénéré avec sa nouvelle quantité 
est intégré dans le panier,  
*sinon la fonction ajoute le produit sélectionné dans le panier avec ses éléments : id, couleur et quantité  */
function addProduct(ProductJson) {

       let tableBasket = getBasket();
       let searchProduct = tableBasket.find(element => element._id === ProductJson._id & element.color === colors.value);

       if (searchProduct != undefined) {
              // ajout du produit avec une quantité limitée à 100
              let newQuantity = parseInt(quantity.value) + parseInt(searchProduct.quantity)
              if (newQuantity <= 100) {
                     let newProduct = {
                            _id: ProductJson._id,
                            color: colors.value,
                            quantity: parseInt(newQuantity)
                     }
                     //substitue le produit par l'index afin de conserver l'ordre des commandes
                     let indexProduct = tableBasket.indexOf(searchProduct)
                     tableBasket.splice(indexProduct, 1, newProduct)
                     setBasket(tableBasket);
              }//sinon message si la quantité de 100 est dépassée 
              else {
                     alert("Vous dépassez la quantité maximale autorisée de 100 canapés! Merci de choisir une nouvelle quantité")
              }

       }

       else {
              const productBasket = {
                     _id: ProductJson._id,
                     color: colors.value,
                     quantity: parseInt(quantity.value)
              }

              tableBasket.push(productBasket);
              setBasket(tableBasket);
       }
}

/**requête pour obtenir les données json de tous les produits avec l'id récupéré
 * la promesse retournée prend en paramètres le résultat pour déterminer son format
 * retourne le résultat en cas de succès ou indique un message d'erreur*/
fetch(`http://localhost:3000/api/products/${id}`)
       //
       .then(response => {
              if (response) {

                     return response.json();
              }
              throw new Error('Erreur serveur');

       })
       /* *promesse chaînée; si la réponse précédente est positive, la promesse prend en paramètre la réponse au format Json
       * création des balises et attributs pour insérer l'image
       * intégration du nom, de la description, et du prix du produit 
       */
       .then(ProductJson => {

              let div = document.querySelector('.item__img');
              let imgProduct = document.createElement('img');
              imgProduct.setAttribute("src", `${ProductJson.imageUrl}`)
              imgProduct.setAttribute("alt", `${ProductJson.altTxt}`)
              div.appendChild(imgProduct);

              document.getElementById('description').textContent = ProductJson.description;
              document.getElementById('title').textContent = ProductJson.name;
              document.getElementById('price').textContent = ProductJson.price;

              //boucle pour ajouter automatiquement les options de couleurs des produits
              for (let eachColors of ProductJson.colors) {
                     let select = document.querySelector('#colors');
                     let optionColors = document.createElement('option');
                     optionColors.textContent = eachColors;
                     optionColors.setAttribute('value', `${eachColors}`);
                     select.appendChild(optionColors);

              }

              /*fonction pour ajouter le ou les produits au panier en cliquant sur le bouton, avec
              messages à l'utilisateur si la couleur et la quantité sont mal renseignées*/
              const button = document.querySelector('#addToCart');
              button.addEventListener('click', () => {

                     let selectElem = document.querySelector("#colors")
                     let firstOption = selectElem.selectedIndex;

                     if (colors.value == firstOption) {
                            alert("Merci d'indiquer une couleur");
                     }

                     else if (quantity.value == 0) {
                            alert("Merci d'indiquer un nombre d'article(s) entre 1 et 100");
                     }
                     else {
                            addProduct(ProductJson)
                            location.replace("http://127.0.0.1:5500/front/html/index.html")
                     }
              })
       })