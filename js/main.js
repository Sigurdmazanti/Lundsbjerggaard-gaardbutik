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
  function appendProdukter(users, id) {
    let htmlTemplate = "";
    for (const user of users) {
      htmlTemplate += /*html*/ `
      <article class="kort" onclick="showDetailView('${user.Id}')">
      <div class="kort-img">
        <img src="${user.img}">
        </div>
        <div class="kort-indhold">
          <h3>${user.name}</h3>
          <p class="kgpris">${user.kgprice} kr/kg</p>
          <p class="vaegt">Ca. ${user.weight} g</p>
          <p class="pris">Fra ${user.price} kr,-</p>
          <div class="justify-content">
          <div class="dashboard_lagerstatus">${optionalList(user)} ${user.stock}</div>
          <button onclick="productDetail(id)"><img src="./img/arrow-right-solid_1.svg"></button>
          </div>
          </div>
        </div>
      </article>
      `;
      console.log(user.name);
    }
  // if user.category = "Bøffer/Steaks" {
  //document.querySelector("#all-bofferSteaks").innerHTML = htmlTemplate;

    document.querySelector(id).innerHTML = htmlTemplate;
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






var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
      and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".desktop-nav .nav-container ul li");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLi.forEach((li) => {
    li.classList.remove("active");
    if (li.classList.contains(current)) {
      li.classList.add("active");
    }
  });
});