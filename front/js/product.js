//recherche de l'url dans la page en cours - récupére l'id du produit avec la clé dans une variable
let params = new URLSearchParams(document.location.search);
let id = params.get("idProduct");

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

              document.querySelector('.item__img').innerHTML = "<img>"
              let imgProduct = document.querySelector('.item__img img')
              imgProduct.setAttribute("src", `${ProductJson.imageUrl}`)
              imgProduct.setAttribute("alt", `${ProductJson.altTxt}`)
              document.getElementById('description').innerText = ProductJson.description;
              document.getElementById('title').innerText = ProductJson.name;
              document.getElementById('price').innerText = ProductJson.price;

              //boucle pour ajouter automatiquement les options de couleurs des produits
              for (eachColors of ProductJson.colors) {
                     document.querySelector('#colors').innerHTML += `<option value = ${eachColors}>${eachColors}</option>`;
              }
              /*fonction pour ajouter les produits au localStorage
              * prend en paramètre les données des produits
              *intégre les produits avec leurs éléments dans le localStorage*/
              function setBasket(tableBasket) {
                     localStorage.setItem('basket', JSON.stringify(tableBasket));
              }

              //fonction qui crée le panier dans le localStorage s'il n'existe pas sinon elle récupère les données du panier qu'elle transorme au format json   
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
              function addProduct() {

                     let tableBasket = getBasket();
                     let searchProduct = tableBasket.find(element => element.id === ProductJson._id & element.color === colors.value);

                     if (searchProduct != undefined) {

                            let newQuantity = parseInt(quantity.value) + parseInt(searchProduct.quantity)

                            let newProduct = {
                                   id: ProductJson._id,
                                   color: colors.value,
                                   quantity: parseInt(newQuantity)
                            }

                            let newTableBasket = tableBasket.filter(element => element.id !== ProductJson._id || element.color !== colors.value);
                            newTableBasket.push(newProduct)
                            setBasket(newTableBasket);
                     }

                     else {
                            const productBasket = {
                                   id: ProductJson._id,
                                   color: colors.value,
                                   quantity: parseInt(quantity.value)
                            }

                            tableBasket.push(productBasket);
                            setBasket(tableBasket);
                     }
              }
              //fonction qui, au click sur le bouton, ajoute le ou les produits au panier
              const bouton = document.querySelector('#addToCart');
              bouton.addEventListener('click', () => {
                     addProduct();

              })

       })