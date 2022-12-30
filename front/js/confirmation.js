//Suppression du localstorage
localStorage.clear();
//Récupération et affichage du numéro de commande 
let params = new URLSearchParams(document.location.search);
let id = params.get("orderId");
document.querySelector('#orderId').textContent = `${id}` + "-merci pour votre commande"