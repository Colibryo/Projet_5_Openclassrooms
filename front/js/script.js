/**requête pour obtenir les données json de tous les produits avec l'id récupéré
 * la promesse retournée prend en paramètres le résultat pour déterminer son format
 * retourne le résultat en cas de succès ou indique un message d'erreur*/
fetch("http://localhost:3000/api/products")
       .then(response => {
              if (response.ok) {
                     return response.json();
              }
              throw new Error('Erreur serveur');

       })
       /**Fonctions pour afficher les produits sur la page d'accueil  
        * prend en paramètre les données json récupérées
        * récupère et génère en boucle les instances de chaque produits pour les afficher */
       .then(ProductsJson => {
              for (let jsonProduct of ProductsJson) {
                     /*let product = new Products(jsonProduct)*/
                     document.getElementById('items').innerHTML += `<a href="./product.html?idProduct=${jsonProduct._id}">
                                                        <article>
                                                               <img src="${jsonProduct.imageUrl}" alt="${jsonProduct.altTxt}">
                                                               <h3 class="productName">${jsonProduct.name}</h3>
                                                               <p class="productDescription">${jsonProduct.description}</p>
                                                        </article>
                                                 </a> `
              }

       })
