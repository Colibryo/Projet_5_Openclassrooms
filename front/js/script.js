/**class : objet cible copiant les propriétés de chaque produits
 *prend les données json renvoyées avec la requête fetch
 */
class Products {
       constructor(jsonProduct) {
              jsonProduct && Object.assign(this, jsonProduct);
       }
};
/**requête pour obtenir les données json de tous les produits 
 * prend en paramètres le résultat
 * retourne le résultat en cas de succès ou indique un message d'erreur*/
fetch("http://localhost:3000/api/products")
       .then(res => {
              if (res.ok) {
                     return res.json();
              }
              throw new Error('Erreur serveur');

       })
       /**Fonctions pour afficher les produits sur la page d'accueil  
        * prend en paramètre les données json récupérées
        * récupère et génère en boucle les instances de chaque produits pour les afficher */
       .then(ProductsJson => {
              for (let jsonProduct of ProductsJson) {
                     let product = new Products(jsonProduct)
                     document.getElementById('items').innerHTML += `<a href="./product.html?${product._id}">
                                                        <article>
                                                               <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                               <h3 class="productName">${product.name}</h3>
                                                               <p class="productDescription">${product.description}</p>
                                                        </article>
                                                 </a> `
              }

       })
