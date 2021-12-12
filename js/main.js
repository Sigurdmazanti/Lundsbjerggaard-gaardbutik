import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnpudAe8UD65KZ7IPm8UtZl72KTYMKzXg",
  authDomain: "advanced-frontend-e2d51.firebaseapp.com",
  projectId: "advanced-frontend-e2d51",
  storageBucket: "advanced-frontend-e2d51.appspot.com",
  messagingSenderId: "407869533641",
  appId: "1:407869533641:web:fee7b71b904a6f1e0b4c18",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// reference to database
const _db = getFirestore();

// reference to products collection in database
const _productsRef = collection(_db, "produkter");
const _nyhedRef = collection(_db, "nyheder");
// global variable: product & news arrays
let _products = [];
let _nyhed = [];

// impoterer funktioner til modulet
window.showProduct = (id) => showProduct(id);
window.goBack = (id) => goBack(id);
window.appendProdukterForside = (products) => appendProdukterForside(products);
window.resetVaerdier = () => resetVaerdier();
window.vaerdier = (value) => vaerdier(value);

// lave en ny scroll funktion, der tager brugeren ned på den sektion der klikkes på
function scrollToProductSection(id) {
  const productContainer = document.querySelector(id);
  const offset = 100;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = productContainer.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

document
  .querySelectorAll(".nav-container a, .mobile-nav-container a")
  .forEach((navElement) => {
    navElement.onclick = (element) => {
      element.preventDefault();
      const containerId = navElement.getAttribute("href");
      scrollToProductSection(containerId);
    };
  });

// Burger menu åben og luk
const burger = document.getElementById("burger");
const tabbar = document.getElementById("tabbar");

burger.addEventListener("click", () => {
  tabbar.classList.toggle("display");
});

tabbar.addEventListener("click", () => {
  tabbar.classList.remove("display");
});

// ========== READ ==========

// onSnapshot: listen for realtime updates
onSnapshot(_productsRef, (snapshot) => {
  // mapping snapshot data from firebase in to product objects
  _products = snapshot.docs.map((doc) => {
    const product = doc.data();
    product.id = doc.id;
    return product;
  });

  filterProdukter(_products);
  filterCuts(_products);
  appendProdukterForside(_products);

  // showLoader(false);
});

onSnapshot(_nyhedRef, (snapshot) => {
  // mapping snapshot data from firebase in to product objects
  _nyhed = snapshot.docs.map((doc) => {
    const nyhed = doc.data();
    nyhed.id = doc.id;
    return nyhed;
  });
  appendNyhed(_nyhed);
  // showLoader(false);
});

//En funktion som giver forskellige output alt afhængig af lagerstatus
function optionalList(lager) {
  let htmlOptional = "";
  if (lager.stock == "På lager") {
    htmlOptional += /*html*/ `
      <span class="greendot"></span>
        `;
  }
  if (lager.stock == "Få på lager") {
    htmlOptional += /*html*/ `
      <span class="orangedot"></span>
        `;
  }
  if (lager.stock == "Ikke på lager") {
    htmlOptional += /*html*/ `
      <span class="reddot"></span>
        `;
  }
  return htmlOptional;
}
// Filtrer de forskellige produkter som du ser på produkt siden, så de ryger ind i den passende sektion
function filterProdukter(products) {
  let bofferSteaks = [];
  let stege = [];
  let hakketOkse = [];
  let spegePolse = [];
  let vin = [];
  for (const product of products) {
    if (product.category === "Bøffer/Steaks") {
      bofferSteaks.push(product);
    } else if (product.category === "Hele stege") {
      stege.push(product);
    } else if (product.category === "Hakket oksekød") {
      hakketOkse.push(product);
    } else if (product.category === "Spegepølse") {
      spegePolse.push(product);
    } else if (product.category === "Vin") {
      vin.push(product);
    }
  }
  appendProdukter(bofferSteaks, "all-bofferSteaks");
  appendProdukter(stege, "all-stege");
  appendProdukter(hakketOkse, "all-hakket");
  appendProdukter(spegePolse, "all-spegepolse");
  appendProdukter(vin, "all-vin");
}

// Her appendes appendes produkterne til produkt siden
function appendProdukter(products, containerId) {
  let htmlTemplate = "";
  for (let product of products) {
    htmlTemplate += /*html*/ `
    <article class="kort" onclick="showProduct('${product.id}')">
    <div class="kort-img">
      <img src="${product.img}">
      </div>
      <div class="kort-indhold">
        <h3>${product.name}</h3>
        <p class="kgpris">${product.kgprice} kr/kg</p>
        <p class="vaegt">Ca. ${product.weight} g</p>
        <p class="pris">Fra ${product.price} kr,-</p>
        <div class="justify-content">
        <div class="dashboard_lagerstatus">${optionalList(product)} ${
      product.stock
    }</div>
    <button><img src="./img/arrow-right-solid_1.svg"></button>
        </div>
        </div>
      </div>
    </article>
    `;
  }
  document.querySelector(`#${containerId}`).innerHTML = htmlTemplate;
}

//Produkter append til forsiden
function appendProdukterForside(products) {
  let htmlTemplate = "";
  for (let product of products) {
    if (product.forsideForslag === "Ja") {
      htmlTemplate += /*html*/ `
      <article class="kort" onclick="showProduct('${product.id}')">
      <div class="kort-img"></div>
        <img src="${product.img}">
        </div>
        <div class="kort-indhold">
          <h3>${product.name}</h3>
          <p class="kgpris">${product.kgprice} kr/kg</p>
          <p class="vaegt">Ca. ${product.weight} g</p>
          <p class="pris">Fra ${product.price} kr,-</p>
          <div class="justify-content">
          <div class="dashboard_lagerstatus">${optionalList(product)} ${
        product.stock
      }</div>
          <button><img src="./img/arrow-right-solid_1.svg"></button>
          </div>
          </div>
        </div>
      </article>
      `;
    }
  }

  document.querySelector(".produkt-kort").innerHTML = htmlTemplate;
}

// En kort funktion som appender alle nyheds sektioner
function appendNyhed(nyheder) {
  let htmlTemplate = "";
  for (let nyhed of nyheder) {
    htmlTemplate += /*html*/ `
      <article class="kort">
      <p>${nyhed.nyNyhed}</p>
      </article>
      `;
  }
  document.querySelector("#nyheder").innerHTML = htmlTemplate;
}
//Ala detail view, så gør showProduct meget det samme, hvor du appender informationer for en af objekterne i dit arratý til en produkt side
function showProduct(id) {
  const product = _products.find((product) => product.id == id);
  document.querySelector("#chosen-product").innerHTML = /*html*/ `
  <article class="product-card ${product.name}-color">
  <div class="produkt-navigation mobile-produkt">
  <img onclick="goBack()" src="./img/arrow-right-solid_1.svg">
  <h2>${product.category}</h2>
  </div>
        <div class="produkt-img">
          <img src="${product.img}">
        </div>
        <div class="produkt-indhold">
        <div class="produkt-navigation desktop-produkt">
        <img onclick="goBack()" src="./img/arrow-right-solid_1.svg">
        <h2>${product.category}</h2>
        </div>

        <div class="produkt-names">
          <h3>${product.name}</h3>
          <p class="description">${product.description}</p>
          </div>
<div class="produkt-information">
<div class="specifik-info">
<p class="specifik-info-top">Kilopris</p>
          <p class="specifik-info-bottom">${product.kgprice} kr/kg</p>
          </div>
          <div class="specifik-info">
          <p class="specifik-info-top">Generel vægt</p>
          <p class="specifik-info-bottom">Ca. ${product.weight} g</p>
          </div>
          <div class="specifik-info">
          <p class="specifik-info-top">Fra</p>
          <p class="specifik-info-bottom">${product.price} kr,-</p>
          </div>
          <div class="dashboard_lagerstatus-specifik specifik-info-bottom">${optionalList(
            product
          )} ${product.stock}
    </div>
    </div>
          </div>
        </div>
        </div>
  </article>
    `;
  navigateTo("specific-product");
}

function goBack() {
  window.history.back();
}

// Image mapping
//Her genbruger vi vores filtrerings metode, her tager vi fat i Udskæringer
function filterCuts(products) {
  let chuck = [];
  let brisket = [];
  let plate = [];
  let rib = [];
  let flank = [];
  let topsirloin = [];
  let round = [];

  for (const product of products) {
    if (product.cut === "Højreb") {
      rib.push(product);
    } else if (product.cut === "Bryst") {
      plate.push(product);
    } else if (product.cut === "Bov") {
      brisket.push(product);
    } else if (product.cut === "Skank") {
      flank.push(product);
    } else if (product.cut === "Tyksteg") {
      round.push(product);
    } else if (product.cut === "Tyndsteg") {
      topsirloin.push(product);
    } else if (product.cut === "Tykkam") {
      chuck.push(product);
    }
  }
  appendCuts(rib, "rib-product");
  appendCuts(brisket, "brisket-product");
  appendCuts(plate, "plate-product");
  appendCuts(flank, "flank-product");
  appendCuts(chuck, "chuck-product");
  appendCuts(topsirloin, "topsirloin-product");
  appendCuts(round, "round-product");
}

//Appender til jerseyko udskæringen
function appendCuts(products, containerId) {
  let htmlTemplate = "";
  for (let product of products) {
    htmlTemplate += /*html*/ `
      <article class="kort cutkort" onclick="showProduct('${product.id}')">
      <h3>${product.name}</h3>
      <p>${product.description}<br><br><span class="bold">Klik for at læse mere!</span></p>
      </article>
      `;
  }
  document.querySelector(`#${containerId}`).innerHTML = htmlTemplate;
  document.querySelector(`#${containerId}`).style.display = "none";
}

// Hver funktion tager fat i en del af image mapping, hvor de appender de passende informationer
document.querySelector("#neck").addEventListener("click", function () {
  clearArray();
  let html = "";
  html += `
  <h1>Neck</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  `;
  document.querySelector("#image-beskrivelse").innerHTML = html;
});

document.querySelector("#chuck").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Chuck</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#chuck-product`).style.display = "flex";
});

document.querySelector("#brisket").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Briskett</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#brisket-product`).style.display = "flex";
});

document.querySelector("#plate").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Plate</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#plate-product`).style.display = "flex";
});

document.querySelector("#rib").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Rib</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#rib-product`).style.display = "flex";
});

document.querySelector("#shortloin").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Shortloin</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  `;
});

document.querySelector("#flank").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Flank</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#flank-product`).style.display = "flex";
});

document.querySelector("#top-sirloin").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Top Sirloin</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  `;
  document.querySelector(`#topsirloin-product`).style.display = "flex";
});

document
  .querySelector("#bottom-sirloin")
  .addEventListener("click", function () {
    clearArray();
    document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Bottom Sirloin</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  `;
  });

document.querySelector("#round").addEventListener("click", function () {
  clearArray();
  document.querySelector("#image-beskrivelse").innerHTML = `
  <h1>Round</h1>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
  <br><h3>Fra denne del kan vi tilbyde</h3>
  `;
  document.querySelector(`#round-product`).style.display = "flex";
});

// Sætter alle appendede produkter på jersey side til display none, som en nulstilling af funktionen
function clearArray() {
  document.querySelector(`#chuck-product`).style.display = "none";
  document.querySelector(`#topsirloin-product`).style.display = "none";
  document.querySelector(`#chuck-product`).style.display = "none";
  document.querySelector(`#rib-product`).style.display = "none";
  document.querySelector(`#plate-product`).style.display = "none";
  document.querySelector(`#brisket-product`).style.display = "none";
  document.querySelector(`#round-product`).style.display = "none";
}

// Luk alle værdier
function resetVaerdier() {
  document.getElementById("vaerdi-1").style.display = "none";
  document.getElementById("vaerdi-2").style.display = "none";
  document.getElementById("vaerdi-3").style.display = "none";
}

// Åbner værdi ved onclick
function vaerdier(value) {
  resetVaerdier();
  document.getElementById(value).style.display = "block";
}
