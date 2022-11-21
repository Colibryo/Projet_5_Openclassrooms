let params = new URLSearchParams(document.location.search);
let id = params.get("idProduct");


fetch(`http://localhost:3000/api/products/${id}`)
       .then(response => {
              if (response.ok) {

                     return response.json();
              }
              throw new Error('Erreur serveur');

       })

       .then(ProductJson => {

              document.querySelector('.item__img').innerHTML = "<img>"
              let imgProduct = document.querySelector('.item__img img')
              imgProduct.setAttribute("src", `${ProductJson.imageUrl}`)
              imgProduct.setAttribute("alt", `${ProductJson.altTxt}`)
              document.getElementById('description').innerText = ProductJson.description;
              document.getElementById('title').innerText = ProductJson.name;
              document.getElementById('price').innerText = ProductJson.price;
              
              for (eachColors of ProductJson.colors) {
              document.querySelector('#colors').innerHTML += `<option value = ${eachColors}>${eachColors}</option>`;
               
       }

       } )
