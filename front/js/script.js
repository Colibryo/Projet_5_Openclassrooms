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
       /**Fonction pour afficher les produits sur la page d'accueil  
        * prend en paramètre les données json récupérées
        * récupère et génère en boucle les éléments de chaque produits pour les afficher */
       .then(ProductsJson => {
              for (let jsonProduct of ProductsJson) {
                     let section = document.querySelector('#items');
                     let anchorProducts = document.createElement('a');
                     anchorProducts.setAttribute('href', `./product.html?idProduct=${jsonProduct._id}`);
                     section.appendChild(anchorProducts);
                     
                     let article = document.createElement('article');
                     anchorProducts.appendChild(article);
                     
                     let image = document.createElement('img');
                     image.setAttribute("src", `${jsonProduct.imageUrl}`)
                     image.setAttribute("alt", `${jsonProduct.altTxt}`)
                     article.appendChild(image);
                     
                     let title = document.createElement('h3');
                     title.textContent = `${jsonProduct.name}`
                     article.appendChild(title);
                     
                     let description = document.createElement('p');
                     description.textContent = `${jsonProduct.description}`
                     article.appendChild(description);

              }

       })
