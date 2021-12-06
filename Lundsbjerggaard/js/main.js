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

// ========== READ ==========

// onSnapshot: listen for realtime updates
onSnapshot(_usersRef, (snapshot) => {
  // mapping snapshot data from firebase in to user objects
  _users = snapshot.docs.map((doc) => {
    const user = doc.data();
    user.id = doc.id;
    return user;
    console.log(user);
  });
  console.log(_users);
  appendProdukter(_users);
  console.log(_users);
  // showLoader(false);
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
  function appendProdukter(users) {
    let htmlTemplate = "";
    for (const user of users) {
      htmlTemplate += /*html*/ `
      <article class="kort" onclick="showDetailView('${user.Id}')">
        <img src="${user.img}">
        <div class="kort-indhold">
          <h3>${user.name}</h3>
          <p>${user.kgprice} kr/kg</p>
          <p>Ca. ${user.weight} g</p>
          <p>${user.price} kr,-</p>
          <div class="justify-content">
          <div class="dashboard_lagerstatus"><p>Lagerstatus:</p>${optionalList(user)} ${user.stock}</div>
          </div>
          </div>
        </div>
      </article>
      `;
      console.log(user.name);
    }
    document.querySelector("#forside-kort").innerHTML = htmlTemplate;
  }
appendProdukter();
  //detailview
// function showDetailView(id) {
//     let html = "";
//     const event = _visitDenmarkData.find((event) => event.Id == id);
//     html += `
//     <h1>${event.name}</h1>
//     `;
  
//     document.querySelector("#detailViewContainer").innerHTML = html;
//     navigateTo("detailView");
//   }