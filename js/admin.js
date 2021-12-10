import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const _nyhederRef = collection(_db, "nyheder");
// global variable: users array & selectedUserId
let _users = [];
let _nyheder = [];
let _selectedUserId = "";
let _selectedImgFile = "";
// ========== READ ==========

// Til at hente produkter data fra firebase
onSnapshot(_usersRef, (snapshot) => {
  // mapping snapshot data from firebase in to user objects
  _users = snapshot.docs.map((doc) => {
    const user = doc.data();
    user.id = doc.id;
    return user;
  });

  /* Sorterer array af objects alfabetisk */
  _users.sort((a, b) => a.name.localeCompare(b.name));
  appendUsers(_users);
});

// Til at hente nyhed data fra firebase
onSnapshot(_nyhederRef, (snapshot) => {
  // mapping snapshot data from firebase in to user objects
  _nyheder = snapshot.docs.map((doc) => {
    const nyhed = doc.data();
    nyhed.id = doc.id;
    return nyhed;
  });
  appendNyheder(_nyheder);
});


function forsideAntal() {
  // Finder antal af objects der har property "forsideForslag" med værdien "Ja"
  let count = _users.filter(x => x.forsideForslag == "Ja").length;

  // Tager det samlede antal af properties med "Ja"-værdi og minusser med det ønskede antal for at vise forskellen i sidste statement i forsideAntal()
  let desiredCount = 3;
  let countDifference = count - desiredCount;
  let htmlCount = "";

  // If/elseif/else statement ud fra hvilken værdi variablen "count" har
  if (count === 0) {
    htmlCount += `
    <span class="forside_vist">(${count}/3 vist)</span>
    `;
  } else if (count === 1) {
    htmlCount += `
    <span class="forside_vist">(${count}/3 vist)</span>
    `;
  } else if (count === 2) {
    htmlCount += `
    <span class="forside_vist">(${count}/3 vist)</span>
    `;
  } else if (count === 3) {
    htmlCount += `
    <span class="forside_vist">(${count}/3 vist)</span>
    `;
  }
  // Bruger vores formular countDifference
  else {
    htmlCount += `
    <span class="forside_vist for_mange">(${count}/3 vist)</span><span data-tooltip="Der er lige nu sat ${count}/3 produkter på forsiden. Fjern ${countDifference}." data-flow="top"><img src="img/erroricon.svg"></span>
    `;
  }
  return htmlCount;
}

// Viser en advarsel, hvis admin er i gang med at sætte et ekstra object over på forsiden når max kapacitet (3) er nået
function godkendtForside() {
  // Finder antal af objects der har property "forsideForslag" med værdien "Ja"
  let count = _users.filter(x => x.forsideForslag == "Ja").length;

  // Modal er triggered når max kapacitet er nået
  if (count === 3 || count > 3) {
    Swal.fire({
      title: 'Er du sikker på at du vil tilføje dette produkt?',
      text: "Du har allerede " + count + " produkter sat til at blive vist på forsiden.",
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      showCloseButton: true,
      returnFocus: false,
      focusConfirm: false,
      allowEnterKey: false,
      cancelButtonText: 'Annuller',
      confirmButtonColor: 'green',
      cancelButtonColor: '#D72828',
      confirmButtonText: 'Bekræft'
    })

      // Triggered når admin vælger "bekræft"
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Produktet er sat til at komme på forsiden.',
            '',
            'success'
          ),
            // Skifter radio button værdi til "ja"
            document.querySelector('#ja_forside').checked = true;
          document.querySelector('#ja-forside-update').checked = true;
        }
        // Triggered når brugeren vælger "annuller"
        else {
          Swal.fire(
            'Produktet er ikke sat til at komme på forsiden.',
            '',
            'warning',
          ),
            // Skifter radio button værdi til "nej"
            document.querySelector('#nej_forside').checked = true;
          document.querySelector('#nej-forside-update').checked = true;
        }
      })
  }
}

/* Kalder godkendtForside() når der trykkes */
document.getElementById("ja_forside").addEventListener("click", godkendtForside);
document.getElementById("ja-forside-update").addEventListener("click", godkendtForside);

// Funktion der viser en prik tilsvarende lagerstatus, som bruges i appendUsers()
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

// Appender produkterne 
function appendUsers(users) {
  let htmlTemplate = "";
  for (const user of users) {
    htmlTemplate += /*html*/ `
    <article class="dashboard_products">
      <h3><span>${user.name}</span></h3>
      <img src="${user.img}" class="dashboard_product_img">
      <div class="dashboard_products_info">
	  <p><span class="nyheder_span">Beskrivelse:</span> ${user.description}</p>
	  <p><span class="nyheder_span">Kategori:</span> ${user.category}</p>
	  <p><span class="nyheder_span">Pris:</span> ${user.price}</p>
	  <p><span class="nyheder_span">Vægt:</span> ${user.weight}</p>
    <p><span class="nyheder_span">Kilopris:</span> ${user.kgprice}</p>
	  <p><span class="nyheder_span">Cut:</span> ${user.cut}</p>
    <p><span class="nyheder_span">Vist på forsiden?</span> ${user.forsideForslag}${forsideAntal()}</p>
    <div class="dashboard_lagerstatus"><p>Lagerstatus:</p>${optionalList(
      user
    )} ${user.stock}</div>
    </div>

    <!-- Opdater/slet knapper -->
    <div class="dashboard_buttons">
      <button class="btn-update-user" data-id="${user.id}">Opdater</button>
      <button class="btn-delete-user" data-id="${user.id}">Fjern</button>
    </div>
    </article>
    `;
  }

  document.querySelector("#content").innerHTML = htmlTemplate;

  //attach events to update and delete btns
  document.querySelectorAll(".btn-update-user").forEach((btn) => {
    btn.onclick = () => selectUser(btn.getAttribute("data-id"));
  });

  document.querySelectorAll(".btn-delete-user").forEach((btn) => {
    btn.onclick = () => deleteUser(btn.getAttribute("data-id"));
  });
}


// ========== CREATE ==========
// add a new user to firestore (database)
function createUser() {
  // references to the input fields
  let nameInput = document.querySelector("#name");
  let descriptionInput = document.querySelector("#description");
  let cutInput = document.querySelector("#cut");
  let categoryInput = document.querySelector("#category");
  let priceInput = document.querySelector("#price");
  let weightInput = document.querySelector("#weight");
  let imageInput = document.querySelector("#imagePreview");
  let stockInput = document.querySelector("#lagerstatus");
  let kgpriceInput = document.querySelector("#kgprice");
  let forsideInput = document.querySelector('input[name="forslag"]:checked');
  const newUser = {
    // Gør det første bogstav i sætningen stort
    name: nameInput.value[0].toUpperCase() + nameInput.value.slice(1),
    description: descriptionInput.value[0].toUpperCase() + descriptionInput.value.slice(1),
    cut: cutInput.value,
    category: categoryInput.value,
    price: priceInput.value,
    weight: weightInput.value,
    img: imageInput.src,
    stock: stockInput.value,
    kgprice: kgpriceInput.value,
    forsideForslag: forsideInput.value
  };

  addDoc(_usersRef, newUser);

  //reset
  nameInput.value = "";
  descriptionInput.value = "";
  cutInput.value = "";
  categoryInput.value = "";
  priceInput.value = "";
  weightInput.value = "";
  imageInput.src = "";
  stockInput.value = "";
  kgpriceInput.value = "";
  forsideInput.value = "";
}

// ========== UPDATE ==========
function selectUser(id) {
  _selectedUserId = id;
  const user = _users.find((user) => user.id == _selectedUserId);
  // references to the input fields
  document.querySelector("#nameUpdate").value = user.name;
  document.querySelector("#descriptionUpdate").value = user.description;
  document.querySelector("#cut-update").value = user.cut;
  document.querySelector("#category-update").value = user.category;
  document.querySelector("#price-update").value = user.price;
  document.querySelector("#weight-update").value = user.weight;
  document.querySelector("#imagePreviewUpdate").src = user.img;
  document.querySelector("#lagerstatus-update").value = user.stock;
  document.querySelector("#kgprice-update").value = user.kgprice;
  //scroll to update form
  document.querySelector("#form-update").scrollIntoView({
    behavior: "smooth"
  });
}

function updateUser() {
  const userToUpdate = {
    // Gør det første bogstav i hvert ord stort
    name: document.querySelector("#nameUpdate").value[0].toUpperCase() + nameUpdate.value.slice(1),
    // Gør det første bogstav i sætningen stort
    description: document.querySelector("#descriptionUpdate").value[0].toUpperCase() + descriptionUpdate.value.slice(1),
    cut: document.querySelector("#cut-update").value,
    category: document.querySelector("#category-update").value,
    price: document.querySelector("#price-update").value,
    weight: document.querySelector("#weight-update").value,
    img: document.querySelector("#imagePreviewUpdate").src,
    stock: document.querySelector("#lagerstatus-update").value,
    kgprice: document.querySelector("#kgprice-update").value,
    forsideForslag: document.querySelector('input[name="forslag-update"]:checked').value,
  };
  const userRef = doc(_usersRef, _selectedUserId);
  updateDoc(userRef, userToUpdate);

  // reset
  document.querySelector("#nameUpdate").value = "";
  document.querySelector("#descriptionUpdate").value = "";
  document.querySelector("#cut-update").value = "";
  document.querySelector("#category-update").value = "";
  document.querySelector("#price-update").value = "";
  document.querySelector("#weight-update").value = "";
  document.querySelector("#imagePreviewUpdate").src = "";
  document.querySelector("#lagerstatus-update").value = "";
  document.querySelector("#kgprice-update").value = "";
}

// ========== DELETE ==========
function deleteUser(id) {
  const docRef = doc(_usersRef, id);
  Swal.fire({
    title: 'Er du sikker på at du vil slette dette produkt?',
    text: "Produktet kan ikke genoprettes.",
    icon: 'warning',
    iconColor: 'red',
    showCancelButton: true,
    showCloseButton: true,
    returnFocus: false,
    focusConfirm: false,
    allowEnterKey: false,
    cancelButtonText: 'Annuller',
    confirmButtonColor: 'green',
    cancelButtonColor: '#D72828',
    confirmButtonText: 'Bekræft'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Produktet er nu slettet.',
        '',
        'success'
      ), deleteDoc(docRef);
    } else {
      Swal.fire(
        'Produktet blev beholdt.',
        '',
        'success',
      )
    }
  })
}

function previewImage(file, previewId) {
  if (file) {
    _selectedImgFile = file;
    let reader = new FileReader();
    reader.onload = (event) => {
      document
        .querySelector("#" + previewId)
        .setAttribute("src", event.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// ========== TEXTAREA / NYHEDSEKSEMPEL + GUIDE ==========
/* Finder værdien fra voes <textarea>, fylder vores tomme <div> #showText med den værdi, og tillader samtidig at skrive mere */
function textAreaNews() {
  let textContent = document.getElementById("textContent");
  let textContentPreset = document.getElementById("textContent").value;

  /* Hvert tast der skrives i textContent opdateres i showText i realtime */
  document.getElementById("showText").innerHTML = textContentPreset;
  textContent.onkeyup = textContent.onkeydown = function () {
    document.getElementById("showText").innerHTML = this.value;
  };
}
textAreaNews();

// function nyhedsAntal() {
//   let htmlAntal = "";
//   let nyhedLength = _nyheder.length;
//   if (_nyheder[0]) {
//     htmlAntal += `
//     <span>1</span>
//     `;
//   }

//   else if (_nyheder[1]) {
//     htmlAntal += `
//     <span>2</span>
//     `;
//   }

//   else if (_nyheder[2]) {
//     htmlAntal += `
//     <span>3</span>
//     `;
//   }

//   else if (_nyheder[3]) {
//     htmlAntal += `
//     <span>4</span>
//     `;
//   }
//   return htmlAntal;
// }

function appendNyheder(nyhed) {
  let nyhedTemplate = "";
  for (let nyheden of nyhed) {
    nyhedTemplate += /*html*/ `
    <article>
    <p>${nyheden.nyNyhed}</p>
    <div class="dashboard_buttons">
    <button class="btn-delete-nyhed" data-id="${nyheden.id}">Fjern denne nyhed</button>
    </div>
    </article>
    `;
  }
  document.querySelector("#lavet-nyheder").innerHTML = nyhedTemplate;

  document.querySelectorAll(".btn-delete-nyhed").forEach((btn) => {
    btn.onclick = () => fjernNyhed(btn.getAttribute("data-id"));
  });
}

function lavNyhed() {
  let nyhedInput = document.querySelector("#textContent");
  const nyNyheder = {
    nyNyhed: nyhedInput.value,
  };

  addDoc(_nyhederRef, nyNyheder);
}

function fjernNyhed(id) {
  let nyhedRef = doc(_nyhederRef, id);
  Swal.fire({
    title: 'Er du sikker på at du vil fjerne nyheden?',
    text: "Nyheden kan ikke genoprettes.",
    icon: 'warning',
    iconColor: 'red',
    showCancelButton: true,
    showCloseButton: true,
    returnFocus: false,
    focusConfirm: false,
    allowEnterKey: false,
    cancelButtonText: 'Annuller',
    confirmButtonColor: 'green',
    cancelButtonColor: '#D72828',
    confirmButtonText: 'Bekræft'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Nyheden er nu slettet.',
        '',
        'success'
      ), deleteDoc(nyhedRef);

    } else {
      Swal.fire(
        'Nyheden blev beholdt.',
        '',
        'success',
      )
    }
  })
  console.log(_nyheder);
}

// =========== Loader functionality =========== //

function showLoader(show = true) {
  const loader = document.querySelector("#loader");
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// =========== attach events =========== //
document.querySelector("#btn-update").onclick = () => updateUser();
document.querySelector("#btn-create").onclick = () => createUser();
document.querySelector("#lav-nyhed").onclick = () => lavNyhed();
window.previewImage = (file, previewId) => previewImage(file, previewId);