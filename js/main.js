import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
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

// reference to users collection in database
const _usersRef = collection(_db, "produkter");

// global variable: users array & selectedUserId
let _users = [];
let _selectedUserId = "";
let _selectedImgFile = "";

window.showUser = (id) => showUser(id);
window.goBack = (id) => goBack(id);

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

// ========== READ ==========

// onSnapshot: listen for realtime updates
onSnapshot(_usersRef, (snapshot) => {
  // mapping snapshot data from firebase in to user objects
  _users = snapshot.docs.map((doc) => {
    const user = doc.data();
    user.id = doc.id;
    return user;
  });

  filterProdukter(_users);

  // showLoader(false);
});

const burger = document.getElementById("burger");
const tabbar = document.getElementById("tabbar");

burger.addEventListener("click", () => {
  tabbar.classList.toggle("display");
});

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

function filterProdukter(users) {
  let bofferSteaks = [];
  let stege = [];
  let hakketOkse = [];
  let spegePolse = [];
  let vin = [];
  for (const user of users) {
    if (user.category === "Bøffer/Steaks") {
      bofferSteaks.push(user);
    } else if (user.category === "Hele stege") {
      stege.push(user);
    } else if (user.category === "Hakket oksekød") {
      hakketOkse.push(user);
    } else if (user.category === "Spegepølse") {
      spegePolse.push(user);
    } else if (user.category === "Vin") {
      vin.push(user);
    }
  }
  appendProdukter(bofferSteaks, "all-bofferSteaks");
  appendProdukter(stege, "all-stege");
  appendProdukter(hakketOkse, "all-hakket");
  appendProdukter(spegePolse, "all-spegepolse");
  appendProdukter(vin, "all-vin");
}

function appendProdukter(users, containerId) {
  let htmlTemplate = "";
  for (const user of users) {
    htmlTemplate += /*html*/ `
      <article class="kort">
      <div class="kort-img">
        <img src="${user.img}">
        </div>
        <div class="kort-indhold">
          <h3>${user.name}</h3>
          <p class="kgpris">${user.kgprice} kr/kg</p>
          <p class="vaegt">Ca. ${user.weight} g</p>
          <p class="pris">Fra ${user.price} kr,-</p>
          <div class="justify-content">
          <div class="dashboard_lagerstatus">${optionalList(user)} ${
      user.stock
    }</div>
          <button onclick="showUser('${
            user.id
          }')"><img src="./img/arrow-right-solid_1.svg"></button>
          </div>
          </div>
        </div>
      </article>
      `;
  }

  document.querySelector(`#${containerId}`).innerHTML = htmlTemplate;
}

appendProdukter();

function showUser(id) {
  const user = _users.find((user) => user.id == id);
  document.querySelector("#chosen-product").innerHTML = /*html*/ `
  <article class="product-card ${user.name}-color">
  <div class="produkt-navigation mobile-produkt">
  <img onclick="goBack()" src="./img/arrow-right-solid_1.svg">
  <h2>${user.category}</h2>
  </div>
        <div class="produkt-img">
          <img src="${user.img}">
        </div>
        <div class="produkt-indhold">
        <div class="produkt-navigation desktop-produkt">
        <img onclick="goBack()" src="./img/arrow-right-solid_1.svg">
        <h2>${user.category}</h2>
        </div>
        
        <div class="produkt-names">
          <h3>${user.name}</h3>
          <p class="description">${user.description}</p>
          </div>
<div class="produkt-information">
<div class="specifik-info">
<p class="specifik-info-top">Kilopris</p>
          <p class="specifik-info-bottom">${user.kgprice} kr/kg</p>
          </div>
          <div class="specifik-info">
          <p class="specifik-info-top">Generel vægt</p>
          <p class="specifik-info-bottom">Ca. ${user.weight} g</p>
          </div>
          <div class="specifik-info">
          <p class="specifik-info-top">Fra</p>
          <p class="specifik-info-bottom">${user.price} kr,-</p>
          </div>
          <div class="dashboard_lagerstatus-specifik specifik-info-bottom">${optionalList(
            user
          )} ${user.stock}
    </div></div>
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
